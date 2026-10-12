import createHttpError from "http-errors";

import { ActivityModel, ConversationModel, MessageModel, UserModel } from "#src/models/index.js";
import { isUtcDay, shiftUtcDay, utcDayOf, utcDaysBetween } from "#src/utils/utcDays.js";

const MAX_DAYS = 366;

const activeBetween = async (from, to) => (await ActivityModel.distinct("user", { day: { $gte: from, $lte: to } })).length;

const countsByDay = (rows) => new Map(rows.map(({ _id, count }) => [_id, count]));

const daysAskedFor = (from, to, today) => {
  if (!isUtcDay(from) || !isUtcDay(to) || from > to || to > today) throw createHttpError.BadRequest("Choose a range of days up to today");
  const days = utcDaysBetween(from, to);
  if (days.length > MAX_DAYS) throw createHttpError.BadRequest("Choose a range of a year or less");
  return days;
};

export const overviewOf = async (from, to) => {
  const today = utcDayOf(new Date());
  const days = daysAskedFor(from, to, today);

  const [users, conversations, messages, activeToday, activeWeek, activeMonth, activeInRange, signups, active] = await Promise.all([
    UserModel.countDocuments({ verified: true }),
    ConversationModel.countDocuments(),
    MessageModel.countDocuments({ event: { $exists: false } }),
    ActivityModel.countDocuments({ day: today }),
    activeBetween(shiftUtcDay(today, -6), today),
    activeBetween(shiftUtcDay(today, -29), today),
    activeBetween(from, to),
    UserModel.aggregate([
      { $match: { verified: true, createdAt: { $gte: new Date(`${from}T00:00:00Z`), $lt: new Date(`${shiftUtcDay(to, 1)}T00:00:00Z`) } } },
      { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, count: { $sum: 1 } } },
    ]),
    ActivityModel.aggregate([{ $match: { day: { $gte: from, $lte: to } } }, { $group: { _id: "$day", count: { $sum: 1 } } }]),
  ]);

  const signupsOn = countsByDay(signups);
  const activeOn = countsByDay(active);
  const daily = days.map((day) => ({ day, signups: signupsOn.get(day) ?? 0, active: activeOn.get(day) ?? 0 }));

  return {
    totals: { users, conversations, messages },
    active: { today: activeToday, week: activeWeek, month: activeMonth },
    range: { active: activeInRange, signups: daily.reduce((sum, entry) => sum + entry.signups, 0) },
    daily,
  };
};
