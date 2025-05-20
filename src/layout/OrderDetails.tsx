import { useEffect, useState } from "react";
import { FaTruck } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { Loader } from "../components/Loader";
import { supabase } from "../config/supabaseClient";

type OrderItem = {
  id: string;
  product_id: string;
  product_title: string;
  unit_price: number;
  quantity: number;
  thumbnail: string;
};

type Order = {
  id: string;
  created_at: string;
  status: string;
  total_amount: number;
  currency: string;
  items: OrderItem[];
};

const OrderDetails = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!orderId) return;

      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .select("id, created_at, status, total_amount, currency")
        .eq("id", orderId)
        .single();

      if (orderError || !orderData) {
        console.error("Order fetch failed", orderError);
        setLoading(false);
        return;
      }

      const { data: itemsData, error: itemsError } = await supabase
        .from("order_items")
        .select("id, product_id, product_title, unit_price, quantity")
        .eq("order_id", orderId);

      if (itemsError || !itemsData) {
        console.error("Order items fetch failed", itemsError);
        setLoading(false);
        return;
      }

      const enrichedItems: OrderItem[] = await Promise.all(
        itemsData.map(async (item) => {
          const { data: product } = await supabase
            .from("products")
            .select("thumbnail_url")
            .eq("id", item.product_id)
            .single();

          return {
            ...item,
            thumbnail:
              product?.thumbnail_url ||
              "https://via.placeholder.com/100x100?text=No+Image",
          };
        })
      );

      setOrder({ ...orderData, items: enrichedItems });
      setLoading(false);
    };

    fetchOrderDetails();
  }, [orderId]);

  if (loading) return <Loader>Loading order details...</Loader>;
  if (!order)
    return <p className="text-center text-gray-500">Order not found</p>;

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 space-y-6">
      <div className="border rounded-lg p-5 bg-white shadow-sm space-y-2">
        <h1 className="text-xl font-semibold text-indigo-700">Order Details</h1>
        <p className="text-sm text-gray-600">Order ID: {order.id}</p>
        <p className="text-sm text-gray-600">
          Date: {new Date(order.created_at).toLocaleDateString()}
        </p>
        <p className="text-sm text-gray-600 capitalize">
          Status:{" "}
          <span
            className={`font-medium ${
              order.status === "delivered"
                ? "text-green-600"
                : order.status === "shipped"
                ? "text-yellow-600"
                : "text-gray-700"
            }`}
          >
            {order.status}
          </span>
        </p>
        <p className="text-base font-medium text-gray-800">
          Total: ₹{order.total_amount.toLocaleString("en-IN")}{" "}
          <span className="text-sm font-normal">({order.currency})</span>
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">
          Ordered Items
        </h2>
        {order.items.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-4 bg-white p-4 border rounded-md shadow-sm"
          >
            <img
              src={item.thumbnail}
              alt={item.product_title}
              className="w-16 h-16 object-cover rounded border"
            />
            <div className="flex-1">
              <p className="font-medium text-gray-800">{item.product_title}</p>
              <p className="text-sm text-gray-500">
                ₹{item.unit_price} × {item.quantity} = ₹
                {(item.unit_price * item.quantity).toLocaleString("en-IN")}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-between items-center bg-white p-4 rounded-md border shadow-sm">
        <div className="flex items-center gap-2 text-gray-700">
          <FaTruck className="text-indigo-500" />
          <span>Track shipment</span>
        </div>
        {order.status !== "delivered" && (
          <button className="text-sm px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200">
            Cancel Order
          </button>
        )}
      </div>
    </div>
  );
};

export default OrderDetails;
