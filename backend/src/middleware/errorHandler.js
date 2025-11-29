// backend/src/middleware/errorHandler.js
module.exports = (err, req, res, next) => {
  // If headers already sent, delegate to default Express handler
  if (res.headersSent) return next(err);

  // Log the error server-side (keep it short for production)
  console.error("Error:", err && err.stack ? err.stack : err);

  // Default status code
  const status = err && err.status ? err.status : 500;

  // Friendly message for clients
  const message =
    err && err.message
      ? err.message
      : "Internal Server Error";

  // If it's a Mongoose validation error, expose the first meaningful message
  if (err && err.name === "ValidationError") {
    const first = Object.values(err.errors)[0];
    return res.status(400).json({ message: first?.message || "Validation error" });
  }

  // Avoid leaking stack trace in production
  const payload = { message };
  if (process.env.NODE_ENV !== "production") {
    payload.stack = err && err.stack ? err.stack : undefined;
  }

  res.status(status).json(payload);
};
