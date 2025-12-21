// backend/src/middleware/authMiddleware.js
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const JWT_SECRET = process.env.JWT_SECRET || "change_this_in_prod";

/**
 * Extract token from Authorization header ("Bearer <token>") or cookie "token".
 */
function getTokenFromRequest(req) {
  const authHeader = req.headers?.authorization;
  if (
    authHeader &&
    typeof authHeader === "string" &&
    authHeader.startsWith("Bearer ")
  ) {
    return authHeader.split(" ")[1];
  }

  // Cookie fallback (requires cookie-parser middleware to populate req.cookies)
  if (req.cookies && req.cookies.token) {
    return req.cookies.token;
  }

  return null;
}

/**
 * requireAuth - middleware that ensures a valid JWT and attaches req.user (without password)
 */
async function requireAuth(req, res, next) {
  try {
    const token = getTokenFromRequest(req);
    if (!token)
      return res.status(401).json({ message: "Authorization token missing" });

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    // find user and attach (exclude password)
    const user = await User.findById(decoded.id).select("-password");
    if (!user)
      return res.status(401).json({ message: "User not found for token" });

    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
}

/**
 * optionalAuth - if token present attach req.user, otherwise continue
 */
async function optionalAuth(req, res, next) {
  try {
    const token = getTokenFromRequest(req);
    if (!token) return next();

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      const user = await User.findById(decoded.id).select("-password");
      if (user) req.user = user;
    } catch (e) {
      // ignore token errors for optional auth
    }

    return next();
  } catch (err) {
    next(err);
  }
}

/**
 * requireRole - middleware factory to check roles.
 * Usage: app.get('/admin', requireAuth, requireRole('admin'), handler)
 * Accepts one or more roles: requireRole('admin') or requireRole('admin','moderator')
 */
function requireRole(...allowedRoles) {
  return (req, res, next) => {
    // assume requireAuth ran before; if not, check quickly
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    if (allowedRoles.length === 0) return next(); // no roles specified, allow

    const userRole = (req.user.role || "").toString();
    if (allowedRoles.includes(userRole)) return next();

    return res
      .status(403)
      .json({ message: "Forbidden: insufficient permissions" });
  };
}

module.exports = {
  requireAuth,
  optionalAuth,
  requireRole,
};
