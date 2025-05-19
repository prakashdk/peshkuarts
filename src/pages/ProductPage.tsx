import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../config/supabaseClient";
import AddToCartButton from "../layout/AddToCard";
import BuyNowButton from "../layout/BuyNow";
import PosterDetails from "../layout/PosterDetails";
import ProductGallery from "../layout/ProductGallery";
import { FaMinus, FaPlus } from "react-icons/fa";

export default function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();
      if (error) console.error(error);
      else setProduct(data);
      setLoading(false);
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-gray-500">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-base">Fetching product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-gray-400">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-10 w-10 mb-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9.75 9.75h.008v.008H9.75V9.75zM14.25 9.75h.008v.008h-.008V9.75zM9 16.5h6M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z"
          />
        </svg>
        <p className="text-center text-sm italic">
          Oops! This product doesn't seem to exist.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="p-6 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Left: Product Image */}
        <ProductGallery product={product} />

        {/* Right: Product Details */}
        <div className="flex flex-col justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
            <div className="flex-col items-center gap-4 mb-4 space-y-2">
              <>
                <p className="text-lg text-gray-500 line-through">
                  ₹{product.mrp}.00
                </p>
                <div className="flex items-center gap-4 mb-4">
                  <p className="text-2xl font-bold text-indigo-600">
                    ₹{product.price}.00
                  </p>
                  <div>
                    {product.price < product.mrp && (
                      <span className="bg-green-100 text-green-700 text-sm font-medium px-2 py-0.5 rounded">
                        {Math.round(
                          ((product.mrp - product.price) / product.mrp) * 100
                        )}
                        % off
                      </span>
                    )}
                  </div>
                </div>
              </>
            </div>

            {/* Additional user input fields */}
            <div className="flex items-center justify-start gap-4 px-5 py-4">
              <label className="text-gray-700 font-medium">Quantity:</label>

              <div className="flex items-center border rounded-md overflow-hidden select-none shadow-sm">
                <button
                  onClick={() => setQuantity((q) => (q > 1 ? q - 1 : q))}
                  className="px-2 py-2 text-indigo-600 hover:bg-indigo-50 rounded-full transition"
                  aria-label={`Decrease quantity of ${product.title}`}
                >
                  <FaMinus />
                </button>

                <span className="px-4 py-2 text-gray-800 font-semibold min-w-[2rem] text-center">
                  {quantity}
                </span>

                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="px-2 py-2 text-indigo-600 hover:bg-indigo-50 rounded-full transition"
                  aria-label={`Increase quantity of ${product.title}`}
                >
                  <FaPlus />
                </button>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <AddToCartButton productId={product.id} />
            <BuyNowButton items={[{ productId: product.id, quantity }]} />
          </div>
        </div>
      </div>
      <div>
        <PosterDetails descriptionHTML={product.description} />
      </div>
    </>
  );
}
