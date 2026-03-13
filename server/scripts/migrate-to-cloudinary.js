import "dotenv/config";
import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import Listing from "../src/models/Listing.js";

import { connectDb } from "../src/config/db.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const UPLOADS_DIR = path.join(__dirname, "../uploads");

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function migrate() {
  try {
    console.log("Connecting to MongoDB...");
    await connectDb(process.env.MONGO_URI);
    console.log("✓ Connected");

    const listings = await Listing.find({
      images: { $regex: /^\/uploads\// }
    });

    console.log(`Found ${listings.length} listings with local images.`);

    for (const listing of listings) {
      console.log(`Processing listing: ${listing.title} (${listing._id})`);
      const newImages = [];
      let changed = false;

      for (const imgPath of listing.images) {
        if (imgPath.startsWith("/uploads/")) {
          const fileName = imgPath.replace("/uploads/", "");
          const fullLocalPath = path.join(UPLOADS_DIR, fileName);

          if (fs.existsSync(fullLocalPath)) {
            console.log(`  Uploading ${fileName}...`);
            try {
              const result = await cloudinary.uploader.upload(fullLocalPath, {
                folder: "pet-care-migration",
              });
              newImages.push(result.secure_url);
              changed = true;
              console.log(`  ✓ Uploaded: ${result.secure_url}`);
            } catch (err) {
              console.error(`  × Failed to upload ${fileName}:`, err.message);
              newImages.push(imgPath); // Keep original if failed
            }
          } else {
            console.warn(`  ! File not found: ${fullLocalPath}`);
            newImages.push(imgPath);
          }
        } else {
          newImages.push(imgPath);
        }
      }

      if (changed) {
        listing.images = newImages;
        await listing.save();
        console.log(`  ✓ Updated listing in database`);
      }
    }

    console.log("\nMigration completed!");
    process.exit(0);
  } catch (err) {
    console.error("Migration failed:", err);
    process.exit(1);
  }
}

migrate();
