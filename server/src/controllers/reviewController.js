import Review from "../models/Review.js";
import Request from "../models/Request.js";
import User from "../models/User.js";

export async function createReview(req, res, next) {
  try {
    const { rating, comment, requestId } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: "Rating must be between 1 and 5" });
    }

    // Verify the request exists and is completed
    const request = await Request.findById(requestId)
      .populate("listingId")
      .populate("sellerId")
      .populate("buyerId");

    if (!request) {
      return res.status(404).json({ error: "Request not found" });
    }

    // Only buyer can review
    if (request.buyerId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Only buyer can leave a review" });
    }

    // Request must be completed
    if (request.status !== "completed") {
      return res.status(400).json({ error: "Can only review completed transactions" });
    }

    // Check if review already exists
    const existing = await Review.findOne({ requestId });
    if (existing) {
      return res.status(409).json({ error: "Review already exists for this transaction" });
    }

    const review = await Review.create({
      sellerId: request.sellerId._id,
      buyerId: req.user._id,
      listingId: request.listingId._id,
      requestId,
      rating,
      comment: comment || ""
    });

    res.status(201).json({ review });
  } catch (err) {
    next(err);
  }
}

export async function getSellerReviews(req, res, next) {
  try {
    const { sellerId } = req.params;
    
    // Validate ObjectId format
    if (!sellerId || sellerId.length !== 24) {
      return res.json({ reviews: [], averageRating: 0, totalReviews: 0 });
    }
    
    const reviews = await Review.find({ sellerId })
      .select("sellerId buyerId listingId rating comment createdAt")
      .populate("buyerId", "name")
      .populate("listingId", "title")
      .sort({ createdAt: -1 })
      .batchSize(100)
      .lean();

    // Calculate average rating
    const avgRating = reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

    res.json({
      reviews,
      averageRating: Math.round(avgRating * 10) / 10,
      totalReviews: reviews.length
    });
  } catch (err) {
    // Handle invalid ObjectId
    if (err.name === "CastError") {
      return res.json({ reviews: [], averageRating: 0, totalReviews: 0 });
    }
    next(err);
  }
}

export async function getMyReviews(req, res, next) {
  try {
    const reviews = await Review.find({ buyerId: req.user._id })
      .select("sellerId buyerId listingId rating comment createdAt")
      .populate("sellerId", "name")
      .populate("listingId", "title")
      .sort({ createdAt: -1 })
      .batchSize(100)
      .lean();

    res.json({ reviews });
  } catch (err) {
    next(err);
  }
}
