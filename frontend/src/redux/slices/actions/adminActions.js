import { createApiThunk } from "@/redux/slices/actions/apiThunk";
import axios from "@/utils/axios";

// ------------- Overview Thunk -------------
export const GetOverview = createApiThunk("admin/overview", async ({ from, to }) => (await axios.get("/admin/overview", { params: { from, to } })).data);

// ------------- Audit Log Thunk -------------
export const GetAuditLog = createApiThunk("admin/audit", async (before) => (await axios.get("/admin/audit", { params: { before } })).data);
