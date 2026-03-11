import Listing from "../models/Listing.js";
import Request from "../models/Request.js";
import User from "../models/User.js";
import { sendEmail } from "../utils/email.js";
import { NewRequestEmail, RequestAcceptedEmail } from "../utils/emailTemplates.js";

export async function createRequest(req, res, next) {
  try {

    const { listingId } = req.body;
    const listing = await Listing.findById(listingId);
    if (!listing) return res.status(404).json({ error: "Listing not found" });
    if (listing.status !== "approved") return res.status(400).json({ error: "Listing not available" });

    if (listing.sellerId.toString() === req.user._id.toString()) {
      return res.status(400).json({ error: "Cannot request your own listing" });
    }

    const existing = await Request.findOne({ listingId, buyerId: req.user._id, status: { $in: ["requested", "accepted"] } });
    if (existing) return res.status(409).json({ error: "Request already exists" });

    const request = await Request.create({
      listingId,
      buyerId: req.user._id,
      sellerId: listing.sellerId,
      status: "requested"
    });

    // Send email to seller about new request
    const seller = await User.findById(listing.sellerId);
    const buyer = req.user;
    
    if (seller && seller.email) {
      sendEmail({
        to: seller.email,
        subject: `🎉 New Request for ${listing.title}!`,
        html: NewRequestEmail({ 
          petName: listing.title, 
          buyerName: buyer.name || buyer.email, 
          petPrice: listing.price 
        })
      }).catch(err => console.error('Request email error:', err));
    }

    res.status(201).json({ request });
  } catch (err) {
    next(err);
  }
}

export async function listRequests(req, res, next) {
  try {
    // Show requests where user is involved as either buyer or seller
    const filter = {
      $or: [
        { buyerId: req.user._id },
        { sellerId: req.user._id }
      ]
    };

    const requests = await Request.find(filter)
      .select("listingId buyerId sellerId status createdAt")
      .populate("listingId", "title price images status")
      .populate("buyerId", "name city phone")
      .populate("sellerId", "name city phone")
      .sort({ createdAt: -1 })
      .batchSize(100)
      .lean();

    res.json({ requests });
  } catch (err) {
    next(err);
  }
}

export async function updateRequestStatus(req, res, next) {
  try {
    const { status } = req.body;
    const request = await Request.findById(req.params.id);
    if (!request) return res.status(404).json({ error: "Request not found" });

    const isBuyer = request.buyerId.toString() === req.user._id.toString();
    const isSeller = request.sellerId.toString() === req.user._id.toString();

    if (!isBuyer && !isSeller) return res.status(403).json({ error: "Forbidden" });

    const allowed = ["accepted", "rejected", "completed", "cancelled"];
    if (!allowed.includes(status)) return res.status(400).json({ error: "Invalid status" });

    if (status === "accepted" || status === "rejected") {
      if (!isSeller) return res.status(403).json({ error: "Only seller can accept/reject" });
    }

    if (status === "cancelled") {
      if (!isBuyer) return res.status(403).json({ error: "Only buyer can cancel" });
    }

    if (status === "completed") {
      if (!isSeller) return res.status(403).json({ error: "Only seller can complete" });
      await Listing.findByIdAndUpdate(request.listingId, { status: "sold" });
    }

    request.status = status;
    await request.save();

    // Send email when request is accepted
    if (status === "accepted") {
      const buyer = await User.findById(request.buyerId);
      const listing = await Listing.findById(request.listingId);
      
      if (buyer && buyer.email && listing) {
        sendEmail({
          to: buyer.email,
          subject: `✅ Your request for ${listing.title} was accepted!`,
          html: RequestAcceptedEmail({ 
            petName: listing.title, 
            sellerName: req.user.name || 'The Seller' 
          })
        }).catch(err => console.error('Request accepted email error:', err));
      }
    }

    res.json({ request });
  } catch (err) {
    next(err);
  }
}
