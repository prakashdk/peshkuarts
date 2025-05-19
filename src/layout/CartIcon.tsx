import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import { supabase } from "../config/supabaseClient";
import { useUser } from "../hooks/useUser";
import toast from "react-hot-toast";

export default function CartIcon() {
  const {user} = useUser();
  const [cartCount, setCartCount] = useState<number>(0);

  useEffect(() => {
    if (!user) {
      setCartCount(0);
      return;
    }

    const fetchCartCount = async () => {
      const { data, error } = await supabase
        .from("cart")
        .select("quantity", { count: "exact" })
        .eq("user_id", user.id);

      if (error) {
        toast.error("Error fetching cart count");

        setCartCount(0);
      } else if (data) {
        const totalCount = data.reduce(
          (sum, item) => sum + (item.quantity || 0),
          0
        );
        setCartCount(totalCount);
      }
    };

    fetchCartCount();

    // const channel = supabase
    //   .channel("carts-realtime")
    //   .on(
    //     "postgres_changes",
    //     {
    //       event: "*", // INSERT | UPDATE | DELETE
    //       schema: "public",
    //       table: "carts",
    //       filter: `user_id=eq.${user.id}`,
    //     },
    //     () => {
    //       fetchCartCount();
    //     }
    //   )
    //   .subscribe();

    // return () => {
    //   supabase.removeChannel(channel);
    // };
  }, [user]);

  if (!user) return null;

  return (
    <Link
      to="/cart"
      className="relative text-gray-600 hover:text-indigo-600 transition"
      aria-label="Cart"
    >
      <FaShoppingCart className="text-2xl" />
      {cartCount > 0 ? (
        <span className="absolute -top-1 -right-2 bg-red-600 text-white rounded-full text-xs px-1.5">
          {cartCount}
        </span>
      ) : (
        <span className="absolute -top-1 -right-2 bg-red-600 rounded-full w-2 h-2 p-1.5"></span>
      )}
    </Link>
  );
}
