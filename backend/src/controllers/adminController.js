import { listAuditEntries } from "#src/services/auditService.js";
import { overviewOf } from "#src/services/overviewService.js";

// -------------------------- Overview --------------------------
export const getOverview = async (req, res, next) => {
  try {
    return res.status(200).json({ status: "success", ...(await overviewOf(req.query.from, req.query.to)) });
  } catch (error) {
    next(error);
  }
};

// -------------------------- Audit log --------------------------
export const getAuditLog = async (req, res, next) => {
  try {
    return res.status(200).json({ status: "success", ...(await listAuditEntries(req.query.before)) });
  } catch (error) {
    next(error);
  }
};
