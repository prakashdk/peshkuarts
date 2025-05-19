import { useNavigate } from "react-router-dom";
import { useCheckout, type OrderItem } from "../hooks/useCheckout";
import { useUser } from "../hooks/useUser";

type ProceedToCheckoutProps = {
  items: OrderItem[];
};

export default function ProceedToCheckout({ items }: ProceedToCheckoutProps) {
  const { user, loading: isUserLoading } = useUser();
  const { startBuyNow } = useCheckout();
  const navigate = useNavigate();

  const handleBuyNow = () => {
    if (!user) {
      navigate("/login");
    } else {
      startBuyNow(items);
    }
  };

  return (
    <button
      disabled={items.length === 0 || isUserLoading}
      className="bg-indigo-600 text-white px-6 py-3 rounded hover:bg-indigo-700 transition"
      onClick={handleBuyNow}
    >
      Proceed to Checkout
    </button>
  );
}
