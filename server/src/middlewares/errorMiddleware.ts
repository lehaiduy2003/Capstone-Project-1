import { Response } from "express";

// Error handling middleware
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const errorHandler = (err: any, res: Response): void => {
  console.error(err.stack); // Log the error stack for debugging
  res.status(err.status || 500).send({
    success: false,
    message: err.message || "Internal Server Error",
  });
  return;
};

export default errorHandler;
