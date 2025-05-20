import React, { useState } from "react";
import { supabase } from "../config/supabaseClient";
import toast from "react-hot-toast";
import { useUser } from "../hooks/useUser";

type WriteReviewButtonProps = {
  productId: string;
};

const WriteReviewButton: React.FC<WriteReviewButtonProps> = ({ productId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const user = useUser((s) => s.user);

  const openModal = () => {
    if (!user) {
      toast.error("You must be logged in to write a review");
      return;
    }
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setRating(0);
    setComment("");
    setLoading(false);
  };

  const submitReview = async () => {
    if (rating < 1 || rating > 5) {
      toast.error("Please select a rating from 1 to 5 stars");
      return;
    }

    setLoading(true);
    const { error } = await supabase.from("reviews").insert({
      product_id: productId,
      user_id: user.id,
      rating,
      review_text: comment.trim() || null,
    });

    if (error) {
      toast.error("Failed to submit review. Try again.");
      setLoading(false);
      return;
    }

    toast.success("Review submitted! Thanks for your feedback.");
    closeModal();
  };

  return (
    <>
      <button
        onClick={openModal}
        className="px-4 py-1 text-sm bg-indigo-600 hover:bg-indigo-700 text-white rounded-md"
      >
        Write Review
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-96 p-6 relative">
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 text-xl font-bold"
              aria-label="Close modal"
            >
              &times;
            </button>

            <h2 className="text-xl font-semibold mb-4">Write a Review</h2>

            <div className="mb-4">
              <label className="block mb-1 font-medium">Rating</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    filled={star <= rating}
                    onClick={() => setRating(star)}
                  />
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="comment" className="block mb-1 font-medium">
                Comment (optional)
              </label>
              <textarea
                id="comment"
                rows={4}
                className="w-full border border-gray-300 rounded-md p-2 resize-none"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Write your thoughts here..."
              />
            </div>

            <button
              onClick={submitReview}
              disabled={loading}
              className={`w-full py-2 rounded-md text-white ${
                loading
                  ? "bg-indigo-300 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700"
              }`}
            >
              {loading ? "Submitting..." : "Submit Review"}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

const Star: React.FC<{ filled: boolean; onClick: () => void }> = ({
  filled,
  onClick,
}) => (
  <svg
    onClick={onClick}
    xmlns="http://www.w3.org/2000/svg"
    fill={filled ? "#F59E0B" : "none"}
    viewBox="0 0 24 24"
    stroke="#F59E0B"
    strokeWidth={2}
    className="w-6 h-6 cursor-pointer"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.966a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.921-.755 1.688-1.54 1.118l-3.38-2.455a1 1 0 00-1.175 0l-3.38 2.455c-.784.57-1.838-.197-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.044 9.393c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.966z"
    />
  </svg>
);

export default WriteReviewButton;
