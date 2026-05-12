import { Request, Response } from "express";
import { successResponse } from "../../common/utils/response";
import { asyncHandler } from "../../common/utils/async-handler";
import * as authService from "./auth.service";
import { prisma } from "../../config/prisma";
import { AUDIT_ACTIONS } from "../../common/constants/audit-actions";

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const result = await authService.login(email, password);

  await prisma.auditLog.create({
    data: {
      userId: result.user.id,
      action: AUDIT_ACTIONS.LOGIN,
      tableName: "users",
      recordId: result.user.id,
      description: `Đăng nhập: ${result.user.email}`,
    },
  });

  successResponse(res, result, "Đăng nhập thành công");
});

export const refresh = asyncHandler(async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  const result = await authService.refreshAccessToken(refreshToken);
  successResponse(res, result, "Làm mới token thành công");
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  const result = await authService.logout(refreshToken);
  successResponse(res, result, "Đăng xuất thành công");
});

export const logoutAll = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.logoutAll(req.user!.id);
  successResponse(res, result, "Đăng xuất khỏi tất cả thiết bị thành công");
});

export const getMe = asyncHandler(async (req: Request, res: Response) => {
  const user = await authService.getMe(req.user!.id);
  successResponse(res, user);
});
