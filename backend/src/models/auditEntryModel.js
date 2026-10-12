import mongoose from "mongoose";

const MAX_AUDIT_REASON = 500;

// written once and never changed, so the log stays a true account of what staff did
const auditEntrySchema = mongoose.Schema(
  {
    actor: { type: mongoose.Schema.ObjectId, ref: "User", required: true },
    action: { type: String, required: true },
    target: { type: mongoose.Schema.ObjectId, ref: "User" },
    reason: { type: String, trim: true, maxlength: MAX_AUDIT_REASON },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

const AuditEntryModel = mongoose.model("AuditEntry", auditEntrySchema);

export default AuditEntryModel;
