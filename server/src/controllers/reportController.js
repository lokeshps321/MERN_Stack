import Report from "../models/Report.js";
import Listing from "../models/Listing.js";

export async function createReport(req, res, next) {
  try {
    const { listingId, reason, description } = req.body;

    if (!listingId || !reason) {
      return res.status(400).json({ error: "Listing ID and reason required" });
    }

    // Verify listing exists
    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({ error: "Listing not found" });
    }

    // Check if user already reported this listing
    const existing = await Report.findOne({ 
      listingId, 
      reporterId: req.user._id 
    });
    
    if (existing) {
      return res.status(409).json({ error: "You already reported this listing" });
    }

    const report = await Report.create({
      listingId,
      reporterId: req.user._id,
      reason,
      description: description || ""
    });

    // Auto-hide listing if it has 5+ reports
    const reportCount = await Report.countDocuments({ listingId, status: "pending" });
    if (reportCount >= 5) {
      await Listing.findByIdAndUpdate(listingId, { status: "rejected", rejectReason: "Auto-rejected: Multiple reports" });
    }

    res.status(201).json({ report });
  } catch (err) {
    next(err);
  }
}

export async function getReportedListings(req, res, next) {
  try {
    // Only admins can view reports
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }

    const { status = "pending" } = req.query;
    const reports = await Report.find({ status })
      .select("listingId reporterId reason description status adminNotes createdAt")
      .populate("listingId", "title species breed price status")
      .populate("reporterId", "name email")
      .sort({ createdAt: -1 })
      .batchSize(100)
      .lean();

    res.json({ reports });
  } catch (err) {
    next(err);
  }
}

export async function updateReportStatus(req, res, next) {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }

    const { status, adminNotes } = req.body;
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({ error: "Report not found" });
    }

    if (status) report.status = status;
    if (adminNotes) report.adminNotes = adminNotes;

    await report.save();

    res.json({ report });
  } catch (err) {
    next(err);
  }
}

export async function deleteReport(req, res, next) {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }

    await Report.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
}
