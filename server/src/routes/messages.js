import { Router } from "express";
import { z } from "zod";
import { validateBody } from "../middleware/validate.js";
import { authRequired } from "../middleware/clerkAuth.js";
import { listMessages, sendMessage } from "../controllers/messageController.js";

const router = Router();

router.use(authRequired);

router.get("/:requestId", listMessages);
router.post("/:requestId", validateBody(z.object({ text: z.string().min(1).max(1000) })), sendMessage);

export default router;
