import React, { useEffect, useState } from "react";
import { supabase } from "../config/supabaseClient";
import WriteReviewButton from "./WriteReviewButton";

export type OrderItem = {
  product_id: string;
  product_title: string;
  unit_price: number;
  quantity: number;
  product_thumbnail?: string | null;
};

interface OrderItemsProps {
  orderId: string;
}

export const OrderItems: React.FC<OrderItemsProps> = ({ orderId }) => {
  const [items, setItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId) return;

    const fetchItems = async () => {
      setLoading(true);
      setError(null);

      // Use the correct join syntax for Supabase to get product thumbnails
      const { data, error } = await supabase
        .from("order_items")
        .select(
          `
          product_id, 
          product_title, 
          unit_price, 
          quantity,
          products:product_id (thumbnail_url)
          `
        )
        .eq("order_id", orderId);

      if (error) {
        setError("Failed to load order items");
        console.error("OrderItems fetch error:", error);
        setItems([]);
      } else {
        const mapped = (data || []).map((item: any) => ({
          product_id: item.product_id,
          product_title: item.product_title,
          unit_price: Number(item.unit_price),
          quantity: item.quantity,
          product_thumbnail: item.products?.thumbnail_url || null,
        }));
        setItems(mapped);
      }
      setLoading(false);
    };

    fetchItems();
  }, [orderId]);

  if (loading)
    return <p className="p-4 text-gray-600">Loading order items...</p>;
  if (error) return <p className="p-4 text-red-600">{error}</p>;
  if (!items.length)
    return (
      <p className="p-4 text-gray-500 italic">No items found for this order.</p>
    );

  return (
    <div className="border-t divide-y">
      {items.map((item) => (
        <div
          key={item.product_id}
          className="flex items-center gap-4 p-4 hover:bg-gray-50 transition rounded-md"
        >
          <img
            src={
              item.product_thumbnail ||
              "https://via.placeholder.com/80x80?text=No+Image"
            }
            alt={item.product_title}
            className="w-20 h-20 object-cover rounded border"
          />
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-900 truncate">
              {item.product_title}
            </p>
            <p className="text-gray-600">
              Quantity: <span className="font-medium">{item.quantity}</span>
            </p>
            <p className="text-gray-600">
              Price:{" "}
              <span className="font-medium">₹{item.unit_price.toFixed(2)}</span>
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <WriteReviewButton productId={item.product_id} />
            <button
              className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition"
              onClick={() => alert(`Reorder ${item.product_title}`)}
              type="button"
            >
              Reorder
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
