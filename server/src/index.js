import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import path from "path";
import { fileURLToPath } from "url";

import { connectDb } from "./config/db.js";
import listingRoutes from "./routes/listings.js";
import requestRoutes from "./routes/requests.js";
import messageRoutes from "./routes/messages.js";
import adminRoutes from "./routes/admin.js";
import aiRoutes from "./routes/ai.js";
import userRoutes from "./routes/users.js";
import reviewRoutes from "./routes/reviews.js";
import reportRoutes from "./routes/reports.js";
import wishlistRoutes from "./routes/wishlist.js";
import { withClerk } from "./middleware/clerkAuth.js";

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const PORT = process.env.PORT || 5000;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:5173";
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/petcare";

app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(cors({
  origin: CLIENT_ORIGIN,
  credentials: true
}));
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(withClerk);

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.get("/health", (req, res) => {
  res.json({ ok: true, time: new Date().toISOString() });
});

app.use("/api/listings", listingRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/users", userRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/wishlist", wishlistRoutes);

app.use((err, req, res, next) => {
  const status = err.status || 500;
  res.status(status).json({
    error: err.message || "Server error",
    details: process.env.NODE_ENV === "development" ? err.stack : undefined
  });
});

async function start() {
  try {
    await connectDb(MONGO_URI);

    // Backfill missing expiry dates to keep queries index-friendly
    try {
      const { default: Listing } = await import("./models/Listing.js");
      const result = await Listing.updateMany(
        { $or: [{ expiresAt: { $exists: false } }, { expiresAt: null }] },
        [
          {
            $set: {
              expiresAt: {
                $ifNull: [
                  "$expiresAt",
                  { $dateAdd: { startDate: "$createdAt", unit: "day", amount: 60 } }
                ]
              }
            }
          }
        ]
      );
      if (result.modifiedCount > 0) {
        console.log(`Backfilled expiresAt for ${result.modifiedCount} listings`);
      }
    } catch (err) {
      console.warn("Expiry backfill skipped:", err.message);
    }
    
    // Archive expired listings every hour
    setInterval(async () => {
      try {
        const { default: Listing } = await import("./models/Listing.js");
        const result = await Listing.updateMany(
          { 
            status: "approved", 
            expiresAt: { $lt: new Date() } 
          },
          { status: "archived" }
        );
        if (result.modifiedCount > 0) {
          console.log(`Archived ${result.modifiedCount} expired listings`);
        }
      } catch (err) {
        console.error("Error archiving listings:", err.message);
      }
    }, 60 * 60 * 1000); // Every hour
    
    // Run on startup too
    const { default: Listing } = await import("./models/Listing.js");
    await Listing.updateMany(
      { 
        status: "approved", 
        expiresAt: { $lt: new Date() } 
      },
      { status: "archived" }
    );
    
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server", err);
    process.exit(1);
  }
}

start();
