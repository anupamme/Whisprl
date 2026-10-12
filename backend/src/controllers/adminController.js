import { listAuditEntries } from "#src/services/auditService.js";
import { banPerson, listPeople, restorePerson, suspendPerson } from "#src/services/moderationService.js";
import { dismissReport, listReports } from "#src/services/reportQueueService.js";
import { assertConfirmed, confirmationOptions } from "#src/services/passkeyService.js";
import { overviewOf } from "#src/services/overviewService.js";

// -------------------------- Overview --------------------------
export const getOverview = async (req, res, next) => {
  try {
    return res.status(200).json({ status: "success", ...(await overviewOf(req.query.from, req.query.to)) });
  } catch (error) {
    next(error);
  }
};

// -------------------------- People --------------------------
export const getPeople = async (req, res, next) => {
  try {
    const { search, filter = "all", page } = req.query;
    return res.status(200).json({ status: "success", ...(await listPeople({ search, filter, page })) });
  } catch (error) {
    next(error);
  }
};

// -------------------------- Confirming who is acting --------------------------
export const getConfirmationOptions = async (req, res, next) => {
  try {
    return res.status(200).json({ status: "success", options: await confirmationOptions(req.user) });
  } catch (error) {
    next(error);
  }
};

const actOnPerson = (act) => async (req, res, next) => {
  try {
    const { confirmation, ...details } = req.body;
    await assertConfirmed(req.user, confirmation);
    await act(req, details);
    return res.status(200).json({ status: "success" });
  } catch (error) {
    next(error);
  }
};

export const suspend = actOnPerson((req, details) => suspendPerson(req.app.get("io"), req.user, req.params.user_id, details));

export const ban = actOnPerson((req, details) => banPerson(req.app.get("io"), req.user, req.params.user_id, details));

export const restore = actOnPerson((req, details) => restorePerson(req.user, req.params.user_id, details));

// -------------------------- Reports --------------------------
export const getReports = async (req, res, next) => {
  try {
    const { filter = "open", page } = req.query;
    return res.status(200).json({ status: "success", ...(await listReports({ filter, page })) });
  } catch (error) {
    next(error);
  }
};

// dismissing changes nobody's access, so it needs a reason for the log but not the passkey
export const dismiss = async (req, res, next) => {
  try {
    await dismissReport(req.user, req.params.report_id, req.body);
    return res.status(200).json({ status: "success" });
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
