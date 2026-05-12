import { Request, Response } from "express";
import { successResponse } from "../../common/utils/response";
import { asyncHandler } from "../../common/utils/async-handler";
import * as categoryService from "./category.service";

export const getCategories = asyncHandler(
  async (_req: Request, res: Response) => {
    const categories = await categoryService.getCategories();
    successResponse(res, categories);
  }
);

export const getCategoryById = asyncHandler(
  async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const category = await categoryService.getCategoryById(id);
    successResponse(res, category);
  }
);

export const createCategory = asyncHandler(
  async (req: Request, res: Response) => {
    const category = await categoryService.createCategory(
      req.body,
      req.user!.id
    );
    successResponse(res, category, "Tạo danh mục thành công", 201);
  }
);

export const updateCategory = asyncHandler(
  async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const category = await categoryService.updateCategory(
      id,
      req.body,
      req.user!.id
    );
    successResponse(res, category, "Cập nhật danh mục thành công");
  }
);

export const deactivateCategory = asyncHandler(
  async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const category = await categoryService.deactivateCategory(
      id,
      req.user!.id
    );
    successResponse(res, category, "Ẩn danh mục thành công");
  }
);
