import { Router } from "express";
import { z } from "zod";
import { authRequired } from "../middleware/clerkAuth.js";
import { validateBody } from "../middleware/validate.js";
import { getMe, updateRole, updateProfile } from "../controllers/userController.js";

const router = Router();

router.use(authRequired);

router.get("/me", getMe);
router.patch("/role", validateBody(z.object({ role: z.enum(["buyer", "seller"]) })), updateRole);
router.patch("/profile", validateBody(z.object({ name: z.string().min(1) })), updateProfile);

export default router;
