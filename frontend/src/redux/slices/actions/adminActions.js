import { createApiThunk } from "@/redux/slices/actions/apiThunk";
import axios from "@/utils/axios";

// ------------- Audit Log Thunk -------------
export const GetAuditLog = createApiThunk("admin/audit", async (before) => (await axios.get("/admin/audit", { params: { before } })).data);
