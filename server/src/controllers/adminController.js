import Listing from "../models/Listing.js";
import User from "../models/User.js";
import Request from "../models/Request.js";
import { sendEmail } from "../utils/email.js";
import { ListingApprovedEmail } from "../utils/emailTemplates.js";

export async function listPendingListings(req, res, next) {
  try {
    const status = req.query.status || "pending_review";
    const listings = await Listing.find({ status })
      .select("title species price images status createdAt sellerId")
      .sort({ createdAt: -1 })
      .batchSize(100)
      .lean();
    res.json({ listings });
  } catch (err) {
    next(err);
  }
}

export async function approveListing(req, res, next) {
  try {
    const listing = await Listing.findByIdAndUpdate(req.params.id, { status: "approved", rejectReason: undefined }, { new: true });
    if (!listing) return res.status(404).json({ error: "Listing not found" });
    
    // Send approval email to seller
    const seller = await User.findById(listing.sellerId);
    if (seller && seller.email) {
      sendEmail({
        to: seller.email,
        subject: `✅ Your listing "${listing.title}" is now live!`,
        html: ListingApprovedEmail({ listingTitle: listing.title })
      }).catch(err => console.error('Listing approval email error:', err));
    }
    
    res.json({ listing });
  } catch (err) {
    next(err);
  }
}

export async function rejectListing(req, res, next) {
  try {
    const { reason } = req.body;
    const listing = await Listing.findByIdAndUpdate(req.params.id, { status: "rejected", rejectReason: reason || "Rejected by admin" }, { new: true });
    if (!listing) return res.status(404).json({ error: "Listing not found" });
    res.json({ listing });
  } catch (err) {
    next(err);
  }
}

export async function getStats(req, res, next) {
  try {
    const [totalUsers, totalListings, pendingListings, totalRequests] = await Promise.all([
      User.countDocuments(),
      Listing.countDocuments(),
      Listing.countDocuments({ status: "pending_review" }),
      Request.countDocuments()
    ]);
    res.json({ totalUsers, totalListings, pendingListings, totalRequests });
  } catch (err) {
    next(err);
  }
}

export async function listUsers(req, res, next) {
  try {
    const users = await User.find({}, "name email role city verifiedEmail verifiedPhone createdAt").sort({ createdAt: -1 });
    res.json({ users });
  } catch (err) {
    next(err);
  }
}
