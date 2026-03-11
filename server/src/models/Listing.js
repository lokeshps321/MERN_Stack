import mongoose from "mongoose";

const ListingSchema = new mongoose.Schema({
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  title: { type: String, required: true },
  species: { type: String, required: true },
  breed: { type: String },
  ageMonths: { type: Number },
  gender: { type: String, enum: ["male", "female", "unknown"], default: "unknown" },
  vaccinated: { type: Boolean, default: false },
  healthNotes: { type: String },
  price: { type: Number, required: true },
  negotiable: { type: Boolean, default: false },
  images: [{ type: String }],
  location: {
    city: { type: String, required: true },
    coordinates: { type: [Number], index: "2dsphere" }
  },
  status: { type: String, enum: ["draft", "pending_review", "approved", "rejected", "sold", "archived"], default: "pending_review", index: true },
  rejectReason: { type: String },
  expiresAt: { type: Date, index: true }
}, { timestamps: true });

ListingSchema.index({ status: 1, createdAt: -1 });
ListingSchema.index({ status: 1, price: 1 });
ListingSchema.index({ status: 1, "location.city": 1, createdAt: -1 });
ListingSchema.index({ title: "text", breed: "text", species: "text", healthNotes: "text", "location.city": "text" });

const Listing = mongoose.model("Listing", ListingSchema);
export default Listing;
