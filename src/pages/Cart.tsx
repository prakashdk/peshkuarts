import { FaMinus, FaPlus, FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import { Loader } from "../components/Loader";
import { useCart } from "../hooks/useCart";
import { useUser } from "../hooks/useUser";
import BuyNowButton from "../layout/BuyNow";
import ProceedToCheckout from "../layout/ProceedToCheckout";

const Cart = () => {
  const { user, loading: isUserLoading } = useUser();
  const { cartItems, loading, updateQuantity, removeFromCart } = useCart();

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.quantity * item.product.price,
    0
  );

  if ((loading || isUserLoading) && cartItems.length === 0)
    return <Loader>Loading your cart...</Loader>;

  if (!user)
    return (
      <p className="text-center p-6 text-gray-500">
        Please login to see your cart.
      </p>
    );

  if (cartItems.length === 0)
    return <p className="text-center p-6 text-gray-500">Your cart is empty.</p>;

  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-semibold mb-6 text-primary">Your Cart</h1>
      <ul className="space-y-6">
        {cartItems.map(({ id, quantity, product }) => (
          <li
            key={id}
            className="flex items-center border rounded shadow p-4 gap-6"
          >
            <img
              src={product.thumbnail_url}
              alt={product.title}
              className="w-24 h-24 object-cover rounded"
              loading="lazy"
            />
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-primary hover:text-indigo-700 transition">
                <Link to={`/product/${product.id}`}>{product.title}</Link>
              </h2>
              <p className="text-indigo-600 font-semibold mt-1">
                ₹{product.price.toFixed(2)}
              </p>
            </div>

            <div className="flex items-center gap-2 border rounded overflow-hidden select-none">
              <button
                onClick={() => updateQuantity(id, quantity - 1)}
                className="px-3 py-1 hover:bg-indigo-100 transition text-indigo-600"
                aria-label={`Decrease quantity of ${product.title}`}
              >
                <FaMinus />
              </button>
              <span className="px-4 text-primary font-medium">{quantity}</span>
              <button
                onClick={() => updateQuantity(id, quantity + 1)}
                className="px-3 py-1 hover:bg-indigo-100 transition text-indigo-600"
                aria-label={`Increase quantity of ${product.title}`}
              >
                <FaPlus />
              </button>
            </div>

            <p className="w-24 text-right font-semibold text-primary">
              ₹{(product.price * quantity).toFixed(2)}
            </p>

            <button
              onClick={() => removeFromCart(id)}
              className="text-red-600 hover:text-red-800 transition"
              aria-label={`Remove ${product.title} from cart`}
            >
              <FaTrash size={20} />
            </button>
            <BuyNowButton items={[{ productId: product.id, quantity }]} />
          </li>
        ))}
      </ul>

      <section className="mt-8 flex justify-end items-center gap-4">
        <span className="text-xl font-semibold text-primary">
          Total: ₹{totalAmount.toFixed(2)}
        </span>
        <ProceedToCheckout
          items={cartItems.map((item) => ({
            productId: item.product.id,
            quantity: item.quantity,
          }))}
        />
      </section>
    </main>
  );
};

export default Cart;
