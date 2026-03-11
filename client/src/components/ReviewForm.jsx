import React, { useState } from "react";
import { Star, X } from "lucide-react";
import { useToast } from "./Toast.jsx";
import { authedRequest } from "../utils/request.js";
import { useAuth } from "@clerk/react";

export default function ReviewForm({ requestId, sellerId, onClose, onSuccess }) {
  const { getToken } = useAuth();
  const toast = useToast();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating < 1) {
      toast("Please select a rating", "error");
      return;
    }

    try {
      setSubmitting(true);
      await authedRequest(getToken, {
        method: "post",
        url: "/api/reviews",
        data: { requestId, rating, comment }
      });
      toast("Review submitted! Thank you.", "success");
      onSuccess();
      onClose();
    } catch (err) {
      toast(err?.response?.data?.error || "Failed to submit review", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in">
      <div className="card-glass rounded-3xl p-6 w-full max-w-md animate-scale-in">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold">Leave a Review</h3>
          <button onClick={onClose} className="text-ink/40 hover:text-ink">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="text-sm font-semibold mb-2 block">Your Rating</label>
            <div className="flex gap-2 justify-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="transition hover:scale-110"
                >
                  <Star
                    size={32}
                    className={star <= rating ? "fill-ember text-ember" : "text-ink/30"}
                  />
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="text-center text-sm text-ink/60 mt-2">
                {rating === 1 && "Poor"}
                {rating === 2 && "Fair"}
                {rating === 3 && "Good"}
                {rating === 4 && "Very Good"}
                {rating === 5 && "Excellent"}
              </p>
            )}
          </div>

          <div className="mb-4">
            <label className="text-sm font-semibold mb-2 block">Comment (optional)</label>
            <textarea
              className="input w-full"
              rows={3}
              placeholder="Share your experience with this seller..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              maxLength={500}
            />
            <p className="text-xs text-ink/50 mt-1">{comment.length}/500</p>
          </div>

          <div className="flex gap-2">
            <button type="button" onClick={onClose} className="btn-outline flex-1">
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn-primary flex-1"
              disabled={submitting || rating === 0}
            >
              {submitting ? "Submitting..." : "Submit Review"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
