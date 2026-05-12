import { Request, Response, NextFunction } from "express";
import { ForbiddenError } from "../errors/ForbiddenError";

export function requireRole(...roles: string[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      throw new ForbiddenError("Bạn không có quyền thực hiện thao tác này");
    }
    next();
  };
}
