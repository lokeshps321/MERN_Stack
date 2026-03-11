import mongoose from "mongoose";

const ReportSchema = new mongoose.Schema({
  listingId: { type: mongoose.Schema.Types.ObjectId, ref: "Listing", required: true, index: true },
  reporterId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  reason: { 
    type: String, 
    enum: ["scam", "fake", "inappropriate", "sold", "duplicate", "other"], 
    required: true 
  },
  description: { type: String, maxlength: 500 },
  status: { 
    type: String, 
    enum: ["pending", "reviewed", "resolved", "dismissed"], 
    default: "pending",
    index: true 
  },
  adminNotes: { type: String }
}, { timestamps: true });

// Prevent duplicate reports from same user for same listing
ReportSchema.index({ listingId: 1, reporterId: 1 }, { unique: true });

const Report = mongoose.model("Report", ReportSchema);
export default Report;
