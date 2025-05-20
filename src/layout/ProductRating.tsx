import React, { useEffect, useState } from "react";
import { supabase } from "../config/supabaseClient";

type ProductRatingProps = {
  productId: string;
};

const ProductRating: React.FC<ProductRatingProps> = ({ productId }) => {
  const [avgRating, setAvgRating] = useState<number | null>(null);
  const [reviewCount, setReviewCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!productId) return;

    const fetchRating = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("reviews")
        .select("rating", { count: "exact" })
        .eq("product_id", productId);

      if (error || !data) {
        setAvgRating(null);
        setReviewCount(0);
        setLoading(false);
        return;
      }

      if (data.length === 0) {
        setAvgRating(null);
        setReviewCount(0);
        setLoading(false);
        return;
      }

      const total = data.reduce((sum, review) => sum + review.rating, 0);
      setAvgRating(total / data.length);
      setReviewCount(data.length);
      setLoading(false);
    };

    fetchRating();
  }, [productId]);

  if (loading) {
    return <p className="text-sm text-gray-500">Loading rating...</p>;
  }

  if (avgRating === null) {
    return <></>;
  }

  return (
    <div className="flex items-center gap-2">
      <Stars rating={avgRating} />
      <span className="text-gray-600 text-sm">({reviewCount})</span>
    </div>
  );
};

const Stars: React.FC<{ rating: number }> = ({ rating }) => {
  // round to nearest half
  const roundedRating = Math.round(rating * 2) / 2;
  const stars = [];

  for (let i = 1; i <= 5; i++) {
    if (i <= roundedRating) {
      // full star
      stars.push(<Star key={i} type="full" />);
    } else if (i - 0.5 === roundedRating) {
      // half star
      stars.push(<Star key={i} type="half" />);
    } else {
      // empty star
      stars.push(<Star key={i} type="empty" />);
    }
  }

  return <div className="flex gap-0.5">{stars}</div>;
};

const Star: React.FC<{ type: "full" | "half" | "empty" }> = ({ type }) => {
  switch (type) {
    case "full":
      return (
        <svg
          className="w-5 h-5 text-yellow-400"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.966a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.921-.755 1.688-1.54 1.118l-3.38-2.455a1 1 0 00-1.175 0l-3.38 2.455c-.784.57-1.838-.197-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.044 9.393c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.966z" />
        </svg>
      );
    case "half":
      return (
        <svg
          className="w-5 h-5 text-yellow-400"
          viewBox="0 0 20 20"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="half-grad">
              <stop offset="50%" stopColor="currentColor" />
              <stop offset="50%" stopColor="transparent" />
            </linearGradient>
          </defs>
          <path
            fill="url(#half-grad)"
            d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.966a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.921-.755 1.688-1.54 1.118l-3.38-2.455a1 1 0 00-1.175 0l-3.38 2.455c-.784.57-1.838-.197-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.044 9.393c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.966z"
          />
        </svg>
      );
    case "empty":
    default:
      return (
        <svg
          className="w-5 h-5 text-gray-300"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          viewBox="0 0 20 20"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.966a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.921-.755 1.688-1.54 1.118l-3.38-2.455a1 1 0 00-1.175 0l-3.38 2.455c-.784.57-1.838-.197-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.044 9.393c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.966z"
          />
        </svg>
      );
  }
};

export default ProductRating;
