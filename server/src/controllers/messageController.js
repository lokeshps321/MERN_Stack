import Message from "../models/Message.js";
import Request from "../models/Request.js";
import User from "../models/User.js";
import Listing from "../models/Listing.js";
import { sendEmail } from "../utils/email.js";
import { NewMessageEmail } from "../utils/emailTemplates.js";

async function ensureParticipant(requestId, userId) {
  const request = await Request.findById(requestId);
  if (!request) return { error: "Request not found" };

  const isBuyer = request.buyerId.toString() === userId.toString();
  const isSeller = request.sellerId.toString() === userId.toString();
  if (!isBuyer && !isSeller) return { error: "Forbidden" };

  return { request };
}

export async function listMessages(req, res, next) {
  try {
    const { request, error } = await ensureParticipant(req.params.requestId, req.user._id);
    if (error) return res.status(error === "Forbidden" ? 403 : 404).json({ error });

    const messages = await Message.find({ requestId: request._id })
      .select("requestId senderId text createdAt")
      .sort({ createdAt: 1 })
      .batchSize(100)
      .lean();
    res.json({ messages });
  } catch (err) {
    next(err);
  }
}

export async function sendMessage(req, res, next) {
  try {
    const { request, error } = await ensureParticipant(req.params.requestId, req.user._id);
    if (error) return res.status(error === "Forbidden" ? 403 : 404).json({ error });

    const message = await Message.create({
      requestId: request._id,
      senderId: req.user._id,
      text: req.body.text
    });

    // Send email notification to other participant
    const otherUserId = request.buyerId.toString() === req.user._id.toString() 
      ? request.sellerId 
      : request.buyerId;
    
    const otherUser = await User.findById(otherUserId);
    const listing = await Listing.findById(request.listingId);
    
    if (otherUser && otherUser.email && listing) {
      sendEmail({
        to: otherUser.email,
        subject: `💬 New message about ${listing.title}`,
        html: NewMessageEmail({ 
          senderName: req.user.name || 'Someone',
          petName: listing.title,
          messagePreview: req.body.text.substring(0, 100)
        })
      }).catch(err => console.error('New message email error:', err));
    }

    res.status(201).json({ message });
  } catch (err) {
    next(err);
  }
}
