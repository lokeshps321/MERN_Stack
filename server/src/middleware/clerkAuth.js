import bcrypt from "bcryptjs";
import { clerkMiddleware, getAuth } from "@clerk/express";
import { clerkClient } from "@clerk/clerk-sdk-node";
import User from "../models/User.js";
import { generateRandomToken } from "../utils/tokens.js";
import { sendEmail } from "../utils/email.js";
import { WelcomeEmail } from "../utils/emailTemplates.js";

export const withClerk = clerkMiddleware({
  publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
  secretKey: process.env.CLERK_SECRET_KEY
});

async function ensureLocalUser(clerkUserId) {
  try {
    let user = await User.findOne({ clerkUserId });
    if (user) {
      // Sync name from Clerk if available
      const clerkUser = await clerkClient.users.getUser(clerkUserId);
      const clerkName = [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ") || clerkUser.username;
      if (clerkName && (!user.name || user.name === "User")) {
        user.name = clerkName;
        await user.save();
      }
      return user;
    }

    const clerkUser = await clerkClient.users.getUser(clerkUserId);
    const email = clerkUser.emailAddresses?.[0]?.emailAddress;
    const name = [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ") || clerkUser.username || "User";

    if (email) {
      user = await User.findOne({ email });
      if (user) {
        user.clerkUserId = clerkUserId;
        user.verifiedEmail = true;
        if (!user.name || user.name === "User") user.name = name;
        await user.save();
        return user;
      }
    }

    const randomPass = generateRandomToken(32);
    const passwordHash = await bcrypt.hash(randomPass, 10);

    const role = email && email === process.env.SEED_ADMIN_EMAIL ? "admin" : "buyer";

    user = await User.create({
      clerkUserId,
      email,
      name,
      passwordHash,
      role,
      verifiedEmail: true
    });

    // Send welcome email (non-blocking)
    sendEmail({
      to: email,
      subject: '🐾 Welcome to PetCare - Your Pet Marketplace!',
      html: WelcomeEmail({ name, email })
    }).catch(err => console.error('Welcome email error:', err));

    return user;
  } catch (err) {
    console.error("ensureLocalUser error:", err);
    throw err;
  }
}

export async function authRequired(req, res, next) {
  try {
    const auth = getAuth(req);
    if (!auth.userId) {
      console.log("No auth.userId found in req");
      return res.status(401).json({ error: "Unauthorized" });
    }

    req.user = await ensureLocalUser(auth.userId);
    req.auth = auth;
    next();
  } catch (err) {
    console.error("authRequired error:", err);
    next(err);
  }
}

export async function authOptional(req, res, next) {
  try {
    const auth = getAuth(req);
    if (!auth.userId) return next();

    req.user = await ensureLocalUser(auth.userId);
    req.auth = auth;
    next();
  } catch (err) {
    console.error("authOptional error:", err);
    next(err);
  }
}
