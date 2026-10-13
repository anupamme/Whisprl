export const isStaff = (role) => role === "owner" || role === "admin";

export const can = (user, permission) => Boolean(user.permissions?.includes(permission));

export const PERMISSIONS = [
  { value: "overview", label: "Overview", description: "Sign-ups, activity and totals" },
  { value: "people", label: "People", description: "Look people up, emails included" },
  { value: "reports", label: "Reports", description: "Read reports and the messages sent with them, and dismiss them" },
  { value: "suspend", label: "Suspend", description: "Suspend people, and lift suspensions" },
  { value: "ban", label: "Ban", description: "Ban people, and lift bans" },
  { value: "audit", label: "Audit log", description: "Read everything staff have done" },
];

export const permissionLabel = (value) => PERMISSIONS.find((permission) => permission.value === value)?.label ?? value;
