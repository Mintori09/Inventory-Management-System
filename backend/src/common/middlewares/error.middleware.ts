import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError";
import { ZodError } from "zod";
import { Prisma } from "@prisma/client";
import { handlePrismaError } from "../utils/prisma-error";

export function errorMiddleware(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  if (err instanceof ZodError) {
    return res.status(422).json({
      success: false,
      message: "Dữ liệu không hợp lệ",
      errors: err.errors.map((e) => ({
        field: e.path.join("."),
        message: e.message,
      })),
    });
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    try {
      handlePrismaError(err);
    } catch (handledErr) {
      if (handledErr instanceof AppError) {
        return res.status(handledErr.statusCode).json({
          success: false,
          message: handledErr.message,
        });
      }
    }
  }

  console.error("Unhandled error:", err);
  return res.status(500).json({
    success: false,
    message: "Internal server error",
  });
}
