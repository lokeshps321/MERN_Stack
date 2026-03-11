import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema({
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  buyerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  listingId: { type: mongoose.Schema.Types.ObjectId, ref: "Listing", required: true },
  requestId: { type: mongoose.Schema.Types.ObjectId, ref: "Request", required: true, unique: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, maxlength: 500 },
  isVerified: { type: Boolean, default: true } // Only buyers who completed purchase can review
}, { timestamps: true });

// Compound index to prevent duplicate reviews for same seller
ReviewSchema.index({ sellerId: 1, buyerId: 1, requestId: 1 });

const Review = mongoose.model("Review", ReviewSchema);
export default Review;
