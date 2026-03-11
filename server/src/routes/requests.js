import { Router } from "express";
import { z } from "zod";
import { validateBody } from "../middleware/validate.js";
import { authRequired } from "../middleware/clerkAuth.js";
import { createRequest, listRequests, updateRequestStatus } from "../controllers/requestController.js";

const router = Router();

router.use(authRequired);

router.get("/", listRequests);
router.post("/", validateBody(z.object({ listingId: z.string().min(6) })), createRequest);
router.patch("/:id/status", validateBody(z.object({ status: z.enum(["accepted", "rejected", "completed", "cancelled"]) })), updateRequestStatus);

export default router;
