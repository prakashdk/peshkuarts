import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../config/supabaseClient";
import { FaShoppingCart, FaBolt } from "react-icons/fa";
import ProductGallery from "../layout/ProductGallery";

export default function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();
      if (error) console.error(error);
      else setProduct(data);
    };

    fetchProduct();
  }, [id]);

  if (!product)
    return <p className="text-center p-6 text-gray-500">Loading product...</p>;

  return (
    <div className="p-6 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
      {/* Left: Product Image */}
      <ProductGallery product={product} />

      {/* Right: Product Details */}
      <div className="flex flex-col justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
          <div className="flex items-center gap-4 mb-4">
            <>
              <p className="text-lg text-gray-500 line-through">
                ₹{product.mrp}
              </p>
              <p className="text-2xl font-bold text-indigo-600">
                ₹{product.price}
              </p>
              {product.price < product.mrp && (
                <span className="bg-green-100 text-green-700 text-sm font-medium px-2 py-0.5 rounded">
                  {Math.round(
                    ((product.mrp - product.price) / product.mrp) * 100
                  )}
                  % off
                </span>
              )}
            </>
          </div>

          <p className="text-gray-700 leading-relaxed mb-6">
            {product.description || "No description available."}
          </p>

          {/* Dummy specs section */}
          <div className="mb-6 space-y-2">
            <h3 className="font-semibold text-lg mb-2 text-gray-800">
              Highlights
            </h3>
            <ul className="list-disc list-inside text-gray-600 text-sm">
              <li>High-quality print and finish</li>
              <li>Safe packaging & delivery</li>
              <li>Available in multiple sizes (on request)</li>
            </ul>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button className="flex-1 flex items-center justify-center gap-2 bg-primary text-secondary py-3 rounded hover:bg-indigo-700 transition">
            <FaShoppingCart />
            Add to Cart
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 bg-primary text-secondary py-3 rounded hover:bg-orange-600 transition">
            <FaBolt />
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}
