import { Response } from "express";

export function successResponse(
  res: Response,
  data: unknown,
  message = "OK",
  status = 200
) {
  return res.status(status).json({
    success: true,
    message,
    data,
  });
}
