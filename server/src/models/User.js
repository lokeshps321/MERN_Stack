import mongoose from "mongoose";

const EmailTokenSchema = new mongoose.Schema({
  tokenHash: { type: String },
  expiresAt: { type: Date }
}, { _id: false });

const OtpSchema = new mongoose.Schema({
  codeHash: { type: String },
  expiresAt: { type: Date }
}, { _id: false });

const UserSchema = new mongoose.Schema({
  clerkUserId: { type: String, index: true, unique: true, sparse: true },
  email: { type: String, unique: true, index: true, required: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ["buyer", "seller", "admin"], default: "buyer" },
  name: { type: String },
  phone: { type: String },
  city: { type: String },
  address: { type: String },
  verifiedEmail: { type: Boolean, default: false },
  verifiedPhone: { type: Boolean, default: false },
  emailVerify: { type: EmailTokenSchema },
  emailOtp: { type: OtpSchema },
  phoneOtp: { type: OtpSchema },
  refreshTokens: [{ type: String }]
}, { timestamps: true });

const User = mongoose.model("User", UserSchema);
export default User;
