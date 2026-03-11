import { Router } from "express";
import { z } from "zod";
import multer from "multer";
import { nanoid } from "nanoid";
import path from "path";
import { validateBody } from "../middleware/validate.js";
import { authOptional, authRequired } from "../middleware/clerkAuth.js";
import { requireRole } from "../middleware/requireRole.js";
import { createListing, deleteListing, getListing, listListings, updateListing } from "../controllers/listingController.js";

const router = Router();

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${nanoid()}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp|avif/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    const mime = allowed.test(file.mimetype) || file.mimetype === "image/avif";
    if (ext && mime) {
      return cb(null, true);
    }
    cb(new Error("Only image files allowed (jpg, png, webp, avif)"));
  }
});

const listingSchema = z.object({
  title: z.string().min(3),
  species: z.string().min(2),
  breed: z.string().optional(),
  ageMonths: z.preprocess((v) => (v === "" ? undefined : v), z.coerce.number().optional()),
  gender: z.enum(["male", "female", "unknown"]).default("unknown"),
  vaccinated: z.coerce.boolean().default(false),
  healthNotes: z.string().optional(),
  price: z.coerce.number(),
  negotiable: z.coerce.boolean().default(false),
  images: z.array(z.string()).optional(),
  city: z.string().min(2),
  lat: z.coerce.number(),
  lng: z.coerce.number()
});

const updateSchema = listingSchema.partial();

router.get("/", authOptional, listListings);
router.get("/:id", authOptional, getListing);
router.post("/", authRequired, requireRole("seller", "admin"), upload.array("images", 6), validateBody(listingSchema), createListing);
router.patch("/:id", authRequired, requireRole("seller", "admin"), upload.array("images", 6), validateBody(updateSchema), updateListing);
router.delete("/:id", authRequired, requireRole("seller", "admin"), deleteListing);

export default router;
