import { useNavigate } from "react-router-dom";
import { supabase } from "../config/supabaseClient"; // adjust as needed
import toast from "react-hot-toast";

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
    items: OrderItem[]; // item.productId and item.quantity
  }): Promise<{ success: boolean; orderId?: string }> => {
    const loadingToast = toast.loading("Placing your order...");

    try {
      // Step 1: Fetch product details to lock name & price
      const productIds = items.map((item) => item.productId);
      const { data: products, error: productsError } = await supabase
        .from("products")
        .select("id, title, price")
        .in("id", productIds);

      if (productsError || !products || products.length !== items.length) {
        toast.error("Failed to fetch product details");
        toast.dismiss(loadingToast);
        return { success: false };
      }

      // Step 2: Map items to include price & name
      const orderItems = items.map((item) => {
        const product = products.find((p) => p.id === item.productId);
        if (!product) {
          toast.error(`Product not found: ${item.productId}`);
          throw new Error(); // local-only to short-circuit
        }

        return {
          order_id: "", // placeholder
          product_id: product.id,
          product_title: product.title,
          unit_price: product.price,
          quantity: item.quantity,
        };
      });

      // Step 3: Calculate total amount
      const totalAmount = orderItems.reduce((sum, item) => {
        return sum + item.unit_price * item.quantity;
      }, 0);

      // Step 4: Insert order
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          user_id,
          address_id,
          total_amount: totalAmount,
          currency: "INR",
          status: "pending",
        })
        .select("id")
        .single();

      if (orderError || !order?.id) {
        toast.error("Failed to place order");
        toast.dismiss(loadingToast);
        return { success: false };
      }

      // Step 5: Insert order items
      const orderItemsWithOrderId = orderItems.map((item) => ({
        ...item,
        order_id: order.id,
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItemsWithOrderId);

      if (itemsError) {
        toast.error("Failed to add items to order");
        toast.dismiss(loadingToast);
        return { success: false };
      }

      toast.success("Order placed successfully!");
      toast.dismiss(loadingToast);
      return { success: true, orderId: order.id };
    } catch (err) {
      console.error("Order error:", err);
      toast.error("Something went wrong while placing the order");
      toast.dismiss(loadingToast);
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
