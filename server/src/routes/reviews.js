import { Router } from "express";
import { z } from "zod";
import { validateBody } from "../middleware/validate.js";
import { authRequired } from "../middleware/clerkAuth.js";
import { createReview, getSellerReviews, getMyReviews } from "../controllers/reviewController.js";

const router = Router();

const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().max(500).optional(),
  requestId: z.string()
});

router.post("/", authRequired, validateBody(reviewSchema), createReview);
router.get("/seller/:sellerId", getSellerReviews);
router.get("/my", authRequired, getMyReviews);

export default router;
