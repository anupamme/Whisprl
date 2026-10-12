import { createApiThunk } from "@/redux/slices/actions/apiThunk";
import axios from "@/utils/axios";
import { notify } from "@/utils/notify";
import { authenticateWithPasskey } from "@/utils/passkeys";

// ------------- Overview Thunk -------------
export const GetOverview = createApiThunk("admin/overview", async ({ from, to }) => (await axios.get("/admin/overview", { params: { from, to } })).data);

// ------------- People Thunk -------------
export const GetPeople = createApiThunk("admin/people", async ({ search, filter, page }) => (await axios.get("/admin/people", { params: { search, filter, page } })).data);

// ------------- Moderation Thunks -------------
// the passkey is asked for as the action is taken, so holding the session alone is never enough
const confirmed = async () => {
  const { data } = await axios.post("/admin/confirm");
  const { response } = await authenticateWithPasskey(data.options);
  return response;
};

const actOnPerson = (path, done) =>
  createApiThunk(`admin/${path}`, async ({ userId, ...details }) => {
    const { data } = await axios.put(`/admin/people/${userId}/${path}`, { ...details, confirmation: await confirmed() });
    notify({ severity: "success", message: done });
    return data;
  });

export const SuspendPerson = actOnPerson("suspend", "Suspended, and their sessions are closed");
export const BanPerson = actOnPerson("ban", "Banned, and their sessions are closed");
export const RestorePerson = actOnPerson("restore", "Their access is back");

// ------------- Reports Thunks -------------
export const GetReports = createApiThunk("admin/reports", async ({ filter, page }) => (await axios.get("/admin/reports", { params: { filter, page } })).data);

export const DismissReport = createApiThunk("admin/dismiss", async ({ reportId, reason }) => {
  const { data } = await axios.put(`/admin/reports/${reportId}/dismiss`, { reason });
  notify({ severity: "success", message: "Dismissed" });
  return data;
});

// ------------- Audit Log Thunk -------------
export const GetAuditLog = createApiThunk("admin/audit", async (before) => (await axios.get("/admin/audit", { params: { before } })).data);
