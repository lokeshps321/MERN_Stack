import { Router } from "express";
import { authRequired } from "../middleware/clerkAuth.js";
import { requireRole } from "../middleware/requireRole.js";
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  checkWishlistStatus
} from "../controllers/wishlistController.js";

const router = Router();

// All wishlist routes require authentication and buyer role
router.use(authRequired);
router.use(requireRole("buyer"));

router.get("/", getWishlist);
router.post("/", addToWishlist);
router.delete("/:listingId", removeFromWishlist);
router.get("/check/:listingId", checkWishlistStatus);

export default router;
