/**
 * A centralized error handling middleware for the Express application.
 *
 * This function is designed to catch errors that occur in the synchronous and
 * asynchronous parts of the application, ensuring that the server doesn't crash
 * and that a consistent, JSON-formatted error message is sent back to the client.
 *
 * It should be the LAST `app.use()` call in your server.js file.
 *
 * @param {Error} err - The error object. Can be a standard Error or a custom one.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The Express next middleware function.
 */
const errorHandler = (err, req, res, next) => {
  // Log the error to the console for debugging.
  // In a production environment, you would use a more robust logger like Winston or Pino.
  console.error(err);

  // Determine the status code. If the error object has a statusCode property,
  // use it. Otherwise, default to 500 (Internal Server Error).
  // This allows you to set custom status codes in your controllers (e.g., res.status(404)).
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  res.status(statusCode);

  // Send back a structured JSON response.
  // We check the NODE_ENV to decide whether to send the error stack trace.
  // The stack trace is very useful for debugging in development but should be
  // hidden in production for security reasons.
  res.json({
    message: err.message,
    // Provide the stack trace only in the development environment
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
  });
};

export default errorHandler;