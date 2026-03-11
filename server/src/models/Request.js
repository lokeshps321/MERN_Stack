import mongoose from "mongoose";

const RequestSchema = new mongoose.Schema({
  listingId: { type: mongoose.Schema.Types.ObjectId, ref: "Listing", required: true },
  buyerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  status: { type: String, enum: ["requested", "accepted", "rejected", "completed", "cancelled"], default: "requested" }
}, { timestamps: true });

const Request = mongoose.model("Request", RequestSchema);
export default Request;
