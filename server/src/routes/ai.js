import { Router } from "express";
import { z } from "zod";
import { validateBody } from "../middleware/validate.js";
import { authOptional } from "../middleware/clerkAuth.js";
import { rateLimit } from "../middleware/rateLimit.js";
import { chat } from "../controllers/aiController.js";

const router = Router();

router.post("/chat", authOptional, rateLimit({ windowMs: 60000, max: 30 }), validateBody(z.object({ message: z.string().min(2).max(1000) })), chat);

export default router;
