import { FaBolt } from "react-icons/fa";
import { useUser } from "../hooks/useUser";
import { useCheckout, type OrderItem } from "../hooks/useCheckout";
import { useNavigate } from "react-router-dom";

type BuyNowButtonProps = {
  items: OrderItem[];
};

export default function BuyNowButton({ items }: BuyNowButtonProps) {
  const { user } = useUser();
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
      className="flex-grow flex-1 flex items-center justify-center gap-2 bg-primary text-secondary py-2 rounded hover:bg-secondary hover:text-primary border-primary border-2 transition"
      onClick={handleBuyNow}
    >
      <FaBolt />
      Buy Now
    </button>
  );
}
