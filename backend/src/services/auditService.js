import createHttpError from "http-errors";
import mongoose from "mongoose";

import { AuditEntryModel } from "#src/models/index.js";

export const recordAction = ({ actor, action, target, reason }) => AuditEntryModel.create({ actor, action, target, reason });

const PAGE_SIZE = 50;
const PERSON_FIELDS = "firstName lastName avatar";

export const listAuditEntries = async (before) => {
  if (before && !mongoose.isValidObjectId(before)) throw createHttpError.BadRequest("That is not a place in the log");

  const entries = await AuditEntryModel.find(before ? { _id: { $lt: before } } : {})
    .sort({ _id: -1 })
    .limit(PAGE_SIZE + 1)
    .populate("actor", PERSON_FIELDS)
    .populate("target", PERSON_FIELDS)
    .lean();

  return { entries: entries.slice(0, PAGE_SIZE), hasMore: entries.length > PAGE_SIZE };
};
