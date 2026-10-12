import { normalizeEmail } from "#src/utils/accountRules.js";

export const roleOf = (user) => (user.email === normalizeEmail(process.env.OWNER_EMAIL) ? "owner" : user.role);

export const isStaff = (user) => roleOf(user) !== "user";
