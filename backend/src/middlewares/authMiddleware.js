import { authenticate } from "#src/services/authService.js";
import { isStaff } from "#src/services/roleService.js";

const bearerTokenOf = (req) => req.get("authorization")?.match(/^Bearer (.+)$/)?.[1];

// ------------------- Protected route middleware -------------------
export const protect = async (req, res, next) => {
  try {
    const { user, sessionId } = await authenticate(bearerTokenOf(req));
    req.user = user;
    req.sessionId = sessionId;
    next();
  } catch (error) {
    next(error);
  }
};

// ------------------- Staff route middleware -------------------
// anyone else leaves this router as if it were not there, so they meet the same 404 as any unknown address
export const staffOnly = (req, res, next) => next(isStaff(req.user) ? undefined : "router");
