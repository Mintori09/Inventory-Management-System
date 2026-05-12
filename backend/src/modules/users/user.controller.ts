import { Request, Response } from "express";
import { successResponse } from "../../common/utils/response";
import { asyncHandler } from "../../common/utils/async-handler";
import * as userService from "./user.service";

export const getUsers = asyncHandler(async (req: Request, res: Response) => {
  const result = await userService.getUsers(req.query as any);
  successResponse(res, result);
});

export const getUserById = asyncHandler(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const user = await userService.getUserById(id);
  successResponse(res, user);
});

export const createUser = asyncHandler(async (req: Request, res: Response) => {
  const user = await userService.createUser(req.body, req.user!.id);
  successResponse(res, user, "Tạo người dùng thành công", 201);
});

export const updateUser = asyncHandler(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const user = await userService.updateUser(id, req.body, req.user!.id);
  successResponse(res, user, "Cập nhật người dùng thành công");
});

export const deactivateUser = asyncHandler(
  async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const user = await userService.deactivateUser(id, req.user!.id);
    successResponse(res, user, "Khóa người dùng thành công");
  }
);
