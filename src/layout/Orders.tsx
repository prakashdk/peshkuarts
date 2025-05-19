import { useEffect, useState } from "react";
import { FaBox, FaTruck, FaTimesCircle } from "react-icons/fa";
import { format } from "date-fns";
import { useUser } from "../hooks/useUser";
import { supabase } from "../config/supabaseClient";
import { Loader } from "../components/Loader";

type Order = {
  id: string;
  created_at: string;
  status: string;
  total: number;
  items: {
    title: string;
    thumbnail: string;
    quantity: number;
  }[];
};

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, loading: isUserLoading } = useUser();

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;

      const { data: rawOrders, error: ordersError } = await supabase
        .from("orders")
        .select("id, created_at, status, total")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (ordersError) {
        console.error("Error fetching orders:", ordersError);
        setLoading(false);
        return;
      }

      const enrichedOrders: Order[] = [];

      for (const order of rawOrders) {
        const { data: items, error: itemsError } = await supabase
          .from("order_items")
          .select("quantity, product_id")
          .eq("order_id", order.id);

        if (itemsError) continue;

        const products = await Promise.all(
          items.map(async (item) => {
            const { data: product } = await supabase
              .from("products")
              .select("title, thumbnail")
              .eq("id", item.product_id)
              .single();

            return {
              title: product?.title || "Product",
              thumbnail:
                product?.thumbnail ||
                "https://via.placeholder.com/100x100?text=No+Image",
              quantity: item.quantity,
            };
          })
        );

        enrichedOrders.push({
          ...order,
          items: products,
        });
      }

      setOrders(enrichedOrders);
      setLoading(false);
    };

    fetchOrders();
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-indigo-700">My Orders</h1>

        {loading || isUserLoading ? (
          <Loader> Loading orders...</Loader>
        ) : orders.length === 0 ? (
          <p className="text-gray-600">You haven’t placed any orders yet.</p>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white shadow-md rounded-lg overflow-hidden border"
              >
                <div className="p-4 border-b flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-500">
                      Order ID: <span className="font-medium">{order.id}</span>
                    </p>
                    <p className="text-sm text-gray-500">
                      Date: {format(new Date(order.created_at), "dd MMM yyyy")}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 text-sm rounded-full font-medium ${
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

                <div className="divide-y">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4 p-4">
                      <img
                        src={item.thumbnail}
                        alt={item.title}
                        className="w-16 h-16 object-cover rounded border"
                      />
                      <div className="flex-1">
                        <p className="text-gray-800 font-semibold">
                          {item.title}
                        </p>
                        <p className="text-sm text-gray-600">
                          Quantity: {item.quantity}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-4 flex justify-between items-center border-t">
                  <p className="text-gray-700 font-medium">
                    Total: ₹{order.total.toLocaleString("en-IN")}
                  </p>
                  <div className="flex gap-2">
                    <button className="text-sm bg-indigo-50 hover:bg-indigo-100 text-indigo-600 px-4 py-1 rounded-md flex items-center gap-1">
                      <FaTruck />
                      Track
                    </button>
                    <button className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-1 rounded-md flex items-center gap-1">
                      <FaBox />
                      Details
                    </button>
                    {order.status !== "Delivered" && (
                      <button className="text-sm bg-red-50 hover:bg-red-100 text-red-600 px-4 py-1 rounded-md flex items-center gap-1">
                        <FaTimesCircle />
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
