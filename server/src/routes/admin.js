import { Router } from "express";
import { z } from "zod";
import { authRequired } from "../middleware/clerkAuth.js";
import { requireRole } from "../middleware/requireRole.js";
import { validateBody } from "../middleware/validate.js";
import { approveListing, listPendingListings, rejectListing, getStats, listUsers } from "../controllers/adminController.js";

const router = Router();

router.use(authRequired, requireRole("admin"));

router.get("/stats", getStats);
router.get("/users", listUsers);
router.get("/listings", listPendingListings);
router.patch("/listings/:id/approve", approveListing);
router.patch("/listings/:id/reject", validateBody(z.object({ reason: z.string().optional() })), rejectListing);

export default router;
