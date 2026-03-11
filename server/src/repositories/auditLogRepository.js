import mongoose from "mongoose";

export async function writeAuditLog(entry) {
  if (!mongoose.connection?.db) return;
  return mongoose.connection
    .db
    .collection("audit_logs")
    .insertOne({ ...entry, createdAt: new Date() }, { writeConcern: { w: 1 } });
}
