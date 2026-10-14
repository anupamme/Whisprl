const DAY_MS = 24 * 60 * 60 * 1000;

const dateOf = (day) => new Date(`${day}T00:00:00Z`);

export const utcDayOf = (date) => date.toISOString().slice(0, 10);

export const shiftUtcDay = (day, count) => utcDayOf(new Date(dateOf(day).getTime() + count * DAY_MS));

// a real calendar day, so 2026-02-31 is refused rather than read as 3 March
export const isUtcDay = (text) => /^\d{4}-\d{2}-\d{2}$/.test(text) && !Number.isNaN(dateOf(text).getTime()) && utcDayOf(dateOf(text)) === text;

export const utcDaysBetween = (from, to) => {
  const days = [];
  for (let day = from; day <= to; day = shiftUtcDay(day, 1)) days.push(day);
  return days;
};
