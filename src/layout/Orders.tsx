import { useEffect, useState } from "react";
import { FaBox, FaTruck, FaTimesCircle } from "react-icons/fa";
import { format } from "date-fns";
import { useUser } from "../hooks/useUser";
import { supabase } from "../config/supabaseClient";
import { Loader } from "../components/Loader";
import { OrderItems } from "./OrderItems";
import { TbTruckReturn } from "react-icons/tb";
import { useNavigate } from "react-router-dom";

type OrderItem = {
  product_id: string;
  title: string;
  thumbnail: string;
  quantity: number;
};

type Order = {
  id: string;
  created_at: string;
  status: string;
  total_amount: number;
  items: OrderItem[];
};

const Orders = () => {
  const { user, loading: userLoading } = useUser();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      setOrders([]);
      setLoading(false);
      return;
    }

    const fetchOrders = async () => {
      setLoading(true);

      // Simplified fetch, no nested items for now
      const { data, error } = await supabase
        .from("orders")
        .select("id, created_at, status, total_amount")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error(error);
        setLoading(false);
        return;
      }

      // Stub for items, you can fill this after
      const enrichedOrders = (data || []).map((order) => ({
        ...order,
        items: [], // will fetch or fill later
      }));

      setOrders(enrichedOrders);
      setLoading(false);
    };

    fetchOrders();
  }, [user]);

  if (loading || userLoading) return <Loader>Loading orders...</Loader>;

  if (!user)
    return (
      <p className="text-center mt-20 text-gray-600">
        Please login to view your orders.
      </p>
    );

  if (orders.length === 0)
    return (
      <p className="text-center mt-20 text-gray-600">
        You haven’t placed any orders yet.
      </p>
    );

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-indigo-700">My Orders</h1>

        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-white shadow-md rounded-lg overflow-hidden border"
          >
            <div className="p-4 border-b flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">
                  Order ID:{" "}
                  <span className="font-mono font-medium">
                    {order.id.slice(0, 8)}
                  </span>
                </p>
                <p className="text-sm text-gray-500">
                  Date: {format(new Date(order.created_at), "dd MMM yyyy")}
                </p>
              </div>
              <span
                className={`px-3 py-1 text-sm rounded-full font-semibold ${
                  order.status === "Delivered"
                    ? "bg-green-100 text-green-700"
                    : order.status === "Shipped"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {order.status}
              </span>
            </div>

            <OrderItems orderId={order.id} />

            <div className="p-4 flex justify-between items-center border-t">
              <p className="text-gray-700 font-medium">
                Total: ₹{order.total_amount.toLocaleString("en-IN")}
              </p>
              <div className="flex gap-2">
                <button className="text-sm bg-indigo-50 hover:bg-indigo-100 text-indigo-600 px-4 py-1 rounded-md flex items-center gap-1">
                  <FaTruck />
                  Track
                </button>
                <button
                  onClick={() => navigate(`/orders/${order.id}`)}
                  className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-1 rounded-md flex items-center gap-1"
                >
                  <FaBox />
                  Details
                </button>
                {order.status !== "delivered" ? (
                  <button className="text-sm bg-red-50 hover:bg-red-100 text-red-600 px-4 py-1 rounded-md flex items-center gap-1">
                    <FaTimesCircle />
                    Cancel
                  </button>
                ) : (
                  <button className="text-sm bg-red-50 hover:bg-red-100 text-red-600 px-4 py-1 rounded-md flex items-center gap-1">
                    <TbTruckReturn />
                    Return
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
