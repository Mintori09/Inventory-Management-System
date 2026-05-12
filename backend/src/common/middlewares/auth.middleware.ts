import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";
import { prisma } from "../../config/prisma";
import { UnauthorizedError } from "../errors/UnauthorizedError";

export async function authMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new UnauthorizedError("Không tìm thấy token");
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);

    const user = await prisma.user.findUnique({
      where: { id: decoded.sub },
      select: { id: true, email: true, role: true, isActive: true },
    });

    if (!user) {
      throw new UnauthorizedError("Người dùng không tồn tại");
    }

    if (!user.isActive) {
      throw new UnauthorizedError("Tài khoản đã bị khóa");
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
}
