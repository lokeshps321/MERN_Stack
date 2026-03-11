import { Router } from "express";
import { z } from "zod";
import { validateBody } from "../middleware/validate.js";
import { authRequired } from "../middleware/clerkAuth.js";
import { requireRole } from "../middleware/requireRole.js";
import { 
  createReport, 
  getReportedListings, 
  updateReportStatus,
  deleteReport 
} from "../controllers/reportController.js";

const router = Router();

const reportSchema = z.object({
  listingId: z.string(),
  reason: z.enum(["scam", "fake", "inappropriate", "sold", "duplicate", "other"]),
  description: z.string().max(500).optional()
});

const updateSchema = z.object({
  status: z.enum(["pending", "reviewed", "resolved", "dismissed"]).optional(),
  adminNotes: z.string().max(500).optional()
});

router.post("/", authRequired, validateBody(reportSchema), createReport);
router.get("/", authRequired, requireRole("admin"), getReportedListings);
router.patch("/:id", authRequired, requireRole("admin"), validateBody(updateSchema), updateReportStatus);
router.delete("/:id", authRequired, requireRole("admin"), deleteReport);

export default router;
