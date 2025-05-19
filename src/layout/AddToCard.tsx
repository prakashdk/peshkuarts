import { useState } from "react";
import { FaShoppingCart } from "react-icons/fa";
import { supabase } from "../config/supabaseClient";
import { useCart } from "../hooks/useCart";
import { useUser } from "../hooks/useUser";

interface AddToCartButtonProps {
  productId: string;
}

export default function AddToCartButton({ productId }: AddToCartButtonProps) {
  const [loading, setLoading] = useState(false);
  const {user} = useUser();
  const { fetchCart } = useCart();

  const addToCart = async (productId: string) => {
    if (!user) return;

    setLoading(true);
    const { data: existing } = await supabase
      .from("cart")
      .select("id, quantity")
      .eq("user_id", user.id)
      .eq("product_id", productId)
      .single();

    if (existing) {
      await supabase
        .from("cart")
        .update({ quantity: existing.quantity + 1 })
        .eq("id", existing.id);
    } else {
      await supabase
        .from("cart")
        .insert({ user_id: user.id, product_id: productId, quantity: 1 });
    }
    setLoading(false);
    fetchCart();
  };

  return (
    <button
      onClick={() => addToCart(productId)}
      disabled={loading}
      className={`
        flex-grow flex-1 flex items-center justify-center gap-2
        bg-primary text-secondary py-3 rounded
        transition
        hover:bg-secondary
        hover:text-primary
        border-primary
        border-2
        active:scale-95
        disabled:opacity-50 disabled:cursor-not-allowed
      `}
    >
      <FaShoppingCart />
      {loading ? "Adding..." : "Add to Cart"}
    </button>
  );
}
