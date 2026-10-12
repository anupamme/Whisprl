import express from "express";

import { protect, staffOnly } from "#src/middlewares/authMiddleware.js";
import { readLimit, searchLimit, writeLimit } from "#src/middlewares/rateLimiters.js";
import { ban, getAuditLog, getConfirmationOptions, getOverview, getPeople, restore, suspend } from "#src/controllers/adminController.js";

const adminRouter = express.Router();

// every admin route sits behind these, so none can be added without them
adminRouter.use(protect, staffOnly);

adminRouter.route("/overview").get(readLimit(), getOverview);

adminRouter.route("/people").get(searchLimit(), getPeople);

adminRouter.route("/confirm").post(writeLimit(), getConfirmationOptions);

adminRouter.route("/people/:user_id/suspend").put(writeLimit(), suspend);

adminRouter.route("/people/:user_id/ban").put(writeLimit(), ban);

adminRouter.route("/people/:user_id/restore").put(writeLimit(), restore);

adminRouter.route("/audit").get(readLimit(), getAuditLog);

export default adminRouter;
