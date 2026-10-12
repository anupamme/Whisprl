import { listAuditEntries } from "#src/services/auditService.js";

// -------------------------- Audit log --------------------------
export const getAuditLog = async (req, res, next) => {
  try {
    return res.status(200).json({ status: "success", ...(await listAuditEntries(req.query.before)) });
  } catch (error) {
    next(error);
  }
};
