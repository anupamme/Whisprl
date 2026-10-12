import { listAuditEntries } from "#src/services/auditService.js";
import { banPerson, listPeople, restorePerson, suspendPerson } from "#src/services/moderationService.js";
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

// -------------------------- Audit log --------------------------
export const getAuditLog = async (req, res, next) => {
  try {
    return res.status(200).json({ status: "success", ...(await listAuditEntries(req.query.before)) });
  } catch (error) {
    next(error);
  }
};
