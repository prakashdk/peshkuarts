import { useEffect, useState } from "react";
import { type CartItem } from "../../hooks/useCart";
import { useCheckout } from "../../hooks/useCheckout";
import { supabase } from "../../config/supabaseClient";
import { Loader } from "../../components/Loader";

type CheckoutConfirmProps = {
  cartItems: CartItem[];
  onBack: () => void;
  onNext: (items: any[]) => void;
};

const CheckoutConfirm = ({
  cartItems,
  onBack,
  onNext,
}: CheckoutConfirmProps) => {
  const { getPendingOrderItems } = useCheckout();
  const [orderItems, setOrderItems] = useState<
    {
      product: any;
      quantity: number;
    }[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrderItems() {
      setLoading(true);
      const pendingItems = getPendingOrderItems();

      if (pendingItems.length === 0) {
        setOrderItems([]);
        setLoading(false);
        return;
      }
      const quantityMap = Object.fromEntries(
        pendingItems.map((item) => [item.productId, item.quantity])
      );

      // Extract all product IDs
      const productIds = pendingItems.map((item) => item.productId);

      // Fetch product details from Supabase
      const { data: products, error } = await supabase
        .from("products")
        .select("*")
        .in("id", productIds);

      if (error || !products) {
        console.error("Failed to fetch products", error);
        setOrderItems([]);
        setLoading(false);
        return;
      }

      const items = products.map((product) => ({
        product,
        quantity: quantityMap[product.id],
      }));

      setOrderItems(items);
      setLoading(false);
    }

    loadOrderItems();
  }, []);

  // Format price with commas
  const formatPrice = (amount: number) =>
    amount.toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    });

  const itemsToShow = orderItems.length === 0 ? cartItems : orderItems;

  const total = itemsToShow.reduce(
    (sum, { product, quantity }) => sum + product.price * quantity,
    0
  );

  if (loading) {
    return <Loader>Loading your orders...</Loader>;
  }

  return (
    <div className="space-y-6">
      {itemsToShow.map(({ product, quantity }) => (
        <div
          key={product.id}
          className="flex items-center justify-between border rounded-lg p-4 shadow-sm"
        >
          <div className="flex items-center gap-4">
            {/* Thumbnail */}
            <img
              src={product.thumbnail_url}
              alt={product.title}
              className="w-16 h-16 object-cover rounded-md border"
            />

            {/* Product info */}
            <div>
              <p className="font-semibold text-lg text-gray-800">
                {product.title}
              </p>
              <p className="text-sm text-gray-600">
                Quantity: {quantity} × {formatPrice(product.price)}
              </p>
            </div>
          </div>

          <p className="font-semibold text-indigo-600 text-lg">
            {formatPrice(product.price * quantity)}
          </p>
        </div>
      ))}

      <div className="flex justify-between items-center font-bold text-xl border-t pt-4 mt-6">
        <p>Total</p>
        <p>{formatPrice(total)}</p>
      </div>

      <div className="flex justify-between mt-6">
        <button
          className="px-5 py-2 border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 transition"
          onClick={onBack}
        >
          Back
        </button>
        <button
          className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          onClick={() =>
            onNext(
              itemsToShow.map((item) => ({
                productId: item.product.id,
                quantity: item.quantity,
              }))
            )
          }
        >
          Proceed to Payment
        </button>
      </div>
    </div>
  );
};

export default CheckoutConfirm;
