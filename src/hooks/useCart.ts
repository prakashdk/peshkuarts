import { useEffect, useState } from "react";
import { supabase } from "../config/supabaseClient";
import { useUser } from "./useUser";

export type CartItem = {
  id: string;
  product: {
    id: string;
    title: string;
    price: number;
    thumbnail_url: string;
  };
  quantity: number;
};

export function useCart() {
  const { user } = useUser();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch cart items on mount or user change
  useEffect(() => {
    if (user) fetchCart();
    else setCartItems([]);
  }, [user]);

  const fetchCart = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("cart")
      .select(
        "id, quantity, product:product_id(id, title, price, thumbnail_url)"
      )
      .eq("user_id", user.id);

    if (!error && data) {
      const items = data.map((item: any) => ({
        id: item.id,
        quantity: item.quantity,
        product: item.product,
      }));
      setCartItems(items);
    }
    setLoading(false);
  };

  const removeFromCart = async (cartId: string) => {
    await supabase.from("cart").delete().eq("id", cartId);
    fetchCart();
  };

  const updateQuantity = async (cartId: string, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCart(cartId);
    } else {
      await supabase.from("cart").update({ quantity }).eq("id", cartId);
      fetchCart();
    }
  };

  const clearCart = async () => {
    await supabase.from("cart").delete().eq("user_id", user.id);
    setCartItems([]);
  };

  return {
    cartItems,
    loading,
    fetchCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  };
}
