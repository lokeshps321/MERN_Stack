import mongoose from "mongoose";

const WishlistSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  listings: [{
    listingId: { type: mongoose.Schema.Types.ObjectId, ref: "Listing", required: true },
    addedAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

// Ensure unique userId
WishlistSchema.index({ userId: 1 }, { unique: true });

const Wishlist = mongoose.model("Wishlist", WishlistSchema);
export default Wishlist;
