import { Request, Response } from "express";
import { successResponse } from "../../common/utils/response";
import { asyncHandler } from "../../common/utils/async-handler";
import * as productService from "./product.service";

export const getProducts = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await productService.getProducts(req.query as any);
    successResponse(res, result);
  }
);

export const getProductById = asyncHandler(
  async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const product = await productService.getProductById(id);
    successResponse(res, product);
  }
);

export const createProduct = asyncHandler(
  async (req: Request, res: Response) => {
    const product = await productService.createProduct(req.body, req.user!.id);
    successResponse(res, product, "Tạo sản phẩm thành công", 201);
  }
);

export const updateProduct = asyncHandler(
  async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const product = await productService.updateProduct(
      id,
      req.body,
      req.user!.id
    );
    successResponse(res, product, "Cập nhật sản phẩm thành công");
  }
);

export const deactivateProduct = asyncHandler(
  async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const result = await productService.deactivateProduct(id, req.user!.id);
    successResponse(res, result, "Ẩn sản phẩm thành công");
  }
);
