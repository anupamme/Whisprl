import { PERMISSIONS } from "#src/models/userModel.js";
import { normalizeEmail } from "#src/utils/accountRules.js";

export const roleOf = (user) => (user.email === normalizeEmail(process.env.OWNER_EMAIL) ? "owner" : user.role);

export const isStaff = (user) => roleOf(user) !== "user";

// running the team is the owner's alone, so it is never among the permissions an admin can be given
export const permissionsOf = (user) => {
  const role = roleOf(user);
  if (role === "owner") return [...PERMISSIONS, "team"];
  return role === "admin" ? (user.permissions ?? []).filter((permission) => PERMISSIONS.includes(permission)) : [];
};

export const can = (user, permission) => permissionsOf(user).includes(permission);
