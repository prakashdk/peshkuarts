import { useNavigate } from "react-router-dom";
import { supabase } from "../config/supabaseClient"; // adjust as needed

export type OrderItem = {
  productId: string;
  quantity: number;
};

const STORAGE_KEY_ITEMS = "pendingOrderItems";
const STORAGE_KEY_ADDRESS_ID = "pendingOrderAddressId";

export function useCheckout() {
  const navigate = useNavigate();

  const startBuyNow = (items: OrderItem[]) => {
    localStorage.setItem(STORAGE_KEY_ITEMS, JSON.stringify(items));
    navigate("/checkout");
  };

  const getPendingOrderItems = (): OrderItem[] => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_ITEMS);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  };

  const setPendingOrderItems = (items: OrderItem[]) => {
    localStorage.setItem(STORAGE_KEY_ITEMS, JSON.stringify(items));
  };

  const getPendingAddressId = (): string | null => {
    return localStorage.getItem(STORAGE_KEY_ADDRESS_ID);
  };

  const setPendingAddressId = (id: string) => {
    localStorage.setItem(STORAGE_KEY_ADDRESS_ID, id);
  };

  const clearPendingOrder = () => {
    localStorage.removeItem(STORAGE_KEY_ITEMS);
    localStorage.removeItem(STORAGE_KEY_ADDRESS_ID);
  };

  const placeOrder = async ({
    user_id,
    address_id,
    items,
  }: {
    user_id: string;
    address_id: string;
    items: OrderItem[];
  }): Promise<{ success: boolean; orderId?: string }> => {
    try {
      // Insert the order record
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          user_id,
          address_id,
        })
        .select("id") // assuming your order id is UUID
        .single();

      if (orderError || !order?.id) throw new Error("Failed to create order");

      const orderItems = items.map((item) => ({
        order_id: order.id,
        product_id: item.productId,
        quantity: item.quantity,
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) throw new Error("Failed to insert order items");

      return { success: true, orderId: order.id };
    } catch (err) {
      console.error("Supabase order failed", err);
      return { success: false };
    }
  };

  return {
    startBuyNow,
    getPendingOrderItems,
    setPendingOrderItems,
    getPendingAddressId,
    setPendingAddressId,
    clearPendingOrder,
    placeOrder,
  };
}
