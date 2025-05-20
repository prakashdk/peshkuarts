import { create } from "zustand";
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

type CartState = {
  cartItems: CartItem[];
  loading: boolean;
  fetchCart: () => Promise<void>;
  removeFromCart: (cartId: string) => Promise<void>;
  updateQuantity: (cartId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
};

export const useCart = create<CartState>((set, get) => ({
  cartItems: [],
  loading: false,

  fetchCart: async () => {
    const user = useUser.getState().user;
    if (!user) return set({ cartItems: [], loading: false });

    set({ loading: true });

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
      set({ cartItems: items, loading: false });
    } else {
      set({ cartItems: [], loading: false });
    }
  },

  removeFromCart: async (cartId: string) => {
    await supabase.from("cart").delete().eq("id", cartId);
    await get().fetchCart();
  },

  updateQuantity: async (cartId: string, quantity: number) => {
    if (quantity <= 0) {
      await get().removeFromCart(cartId);
    } else {
      await supabase.from("cart").update({ quantity }).eq("id", cartId);
      await get().fetchCart();
    }
  },

  clearCart: async () => {
    const user = useUser.getState().user;
    if (!user) return;

    await supabase.from("cart").delete().eq("user_id", user.id);
    set({ cartItems: [] });
  },
}));
