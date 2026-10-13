import { ActivityModel } from "#src/models/index.js";
import { utcDayOf } from "#src/utils/utcDays.js";

// counting someone as active must never stand in the way of signing them in
export const recordActivity = (user_id) => {
  const today = { user: user_id, day: utcDayOf(new Date()) };
  ActivityModel.updateOne(today, { $setOnInsert: today }, { upsert: true }).catch((error) => console.error(`[activity] ${error.message}`));
};
