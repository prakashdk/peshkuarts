import React, { useEffect, useState } from "react";
import { supabase } from "../config/supabaseClient";
import toast from "react-hot-toast";

type Review = {
  id: string;
  user_id: string;
  rating: number;
  review_text: string | null;
  created_at: string;
  user_name?: string; // fetched separately
};

type ProductReviewsProps = {
  productId: string;
};

const ProductReviews: React.FC<ProductReviewsProps> = ({ productId }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!productId) return;

    const fetchReviews = async () => {
      const { data: reviewsData, error: reviewsError } = await supabase
        .from("reviews")
        .select("id, user_id, rating, review_text, created_at")
        .eq("product_id", productId)
        .order("created_at", { ascending: false });

      if (reviewsError) {
        console.error(reviewsError);
        setReviews([]);
        setLoading(false);
        return;
      }

      // Fetch all unique user_ids to get usernames
      const userIds = [...new Set(reviewsData.map((r) => r.user_id))];

      const { data: usersData = [] } = await supabase
        .from("auth.users")
        .select("id, username")
        .in("id", userIds);

      const usersMap = (usersData === null ? [] : usersData).reduce<
        Record<string, string>
      >((acc, user) => {
        acc[user.id] = user.username;
        return acc;
      }, {});

      const reviewsWithUsernames = reviewsData.map<Review>((r) => ({
        ...r,
        user_name: usersMap[r.user_id] || "Anonymous",
      }));

      setReviews(reviewsWithUsernames);
      setLoading(false);
    };

    fetchReviews();
  }, [productId]);

  if (loading)
    return <p className="text-sm text-gray-500">Loading reviews...</p>;

  if (reviews.length === 0)
    return <p className="text-sm text-gray-500">No reviews yet.</p>;

  return (
    <div className="space-y-10 max-w-3xl mx-auto">
      {reviews.map((review) => (
        <div
          key={review.id}
          className="bg-white p-6 rounded-xl shadow-lg border border-transparent
                     hover:border-indigo-400 transition-all duration-300 relative"
        >
          <div className="flex items-center mb-4">
            {/* Avatar placeholder */}
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-lg uppercase mr-4 select-none">
              {review.user_name
                ?.split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)}
            </div>

            <div className="flex-1">
              <p className="font-semibold text-indigo-700 text-lg tracking-wide leading-tight">
                {review.user_name}
              </p>
              <time
                className="text-xs text-gray-400 font-mono"
                dateTime={review.created_at}
                title={new Date(review.created_at).toLocaleString()}
              >
                {new Date(review.created_at).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </time>
            </div>

            <div className="flex items-center space-x-2 ml-auto select-none">
              <Stars rating={review.rating} />
              <span className="text-indigo-600 font-semibold">
                {review.rating}/5
              </span>
            </div>
          </div>

          {review.review_text && (
            <p className="text-gray-800 text-base leading-relaxed whitespace-pre-line select-text mb-6">
              {review.review_text}
            </p>
          )}

          {/* Reply placeholder */}
          <div className="border-t border-gray-200 pt-4 flex justify-between items-center">
            <button
              className="text-indigo-600 hover:text-indigo-800 font-medium text-sm flex items-center gap-1"
              onClick={() => toast.error("Reply feature coming soon!")}
            >
              {/* Use any icon here, like FaReply or similar */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 10h11M3 6h11m-7 8l-4 4m0 0l4 4m-4-4h16"
                />
              </svg>
              Reply
            </button>

            <span className="text-xs text-gray-400 italic">
              Replies coming soon...
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

// Reuse the same Stars component from previous snippet or import it here
const Stars: React.FC<{ rating: number }> = ({ rating }) => {
  const roundedRating = Math.round(rating * 2) / 2;
  const stars = [];

  for (let i = 1; i <= 5; i++) {
    if (i <= roundedRating) {
      stars.push(<Star key={i} type="full" />);
    } else if (i - 0.5 === roundedRating) {
      stars.push(<Star key={i} type="half" />);
    } else {
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

export default ProductReviews;
