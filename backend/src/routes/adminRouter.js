import express from "express";

import { protect, staffOnly } from "#src/middlewares/authMiddleware.js";
import { readLimit } from "#src/middlewares/rateLimiters.js";
import { getAuditLog } from "#src/controllers/adminController.js";

const adminRouter = express.Router();

// every admin route sits behind these, so none can be added without them
adminRouter.use(protect, staffOnly);

adminRouter.route("/audit").get(readLimit(), getAuditLog);

export default adminRouter;
