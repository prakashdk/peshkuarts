import { useEffect, useState } from "react";
import ProductCard from "../layout/ProductCard";
import { supabase } from "../config/supabaseClient";
import { FaBoxOpen } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";

interface Product {
  id: string;
  title: string;
  thumbnail_url: string;
  image_urls: string[];
  price: number;
  mrp: number;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const { data, error } = await supabase.from("products").select("*");

      if (error) {
        console.error(error);
        toast.error("Something went wrong while fetching products.");
        setProducts([]); // gracefully fallback
      } else {
        setProducts(data || []);
      }

      setLoading(false);
    };

    fetchProducts();
  }, []);

  return (
    <div className="min-h-[80vh] px-4 py-8">
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="animate-pulse bg-white p-4 rounded shadow space-y-4"
            >
              <div className="h-80 bg-gray-200 rounded" />
              <div className="h-4 bg-gray-300 w-3/4 rounded" />
              <div className="h-4 bg-gray-300 w-1/2 rounded" />
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-gray-500 mt-20">
          <FaBoxOpen className="text-5xl mb-3" />
          <p className="text-xl font-medium">No products found</p>
          <p className="text-sm text-gray-400 mt-1">
            Please check back later. We're adding more items soon.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      )}
    </div>
  );
}
