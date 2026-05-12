import { Request, Response } from "express";
import { successResponse } from "../../common/utils/response";
import { asyncHandler } from "../../common/utils/async-handler";
import * as supplierService from "./supplier.service";

export const getSuppliers = asyncHandler(
  async (_req: Request, res: Response) => {
    const suppliers = await supplierService.getSuppliers();
    successResponse(res, suppliers);
  }
);

export const getSupplierById = asyncHandler(
  async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const supplier = await supplierService.getSupplierById(id);
    successResponse(res, supplier);
  }
);

export const createSupplier = asyncHandler(
  async (req: Request, res: Response) => {
    const supplier = await supplierService.createSupplier(
      req.body,
      req.user!.id
    );
    successResponse(res, supplier, "Tạo nhà cung cấp thành công", 201);
  }
);

export const updateSupplier = asyncHandler(
  async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const supplier = await supplierService.updateSupplier(
      id,
      req.body,
      req.user!.id
    );
    successResponse(res, supplier, "Cập nhật nhà cung cấp thành công");
  }
);

export const deactivateSupplier = asyncHandler(
  async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const supplier = await supplierService.deactivateSupplier(
      id,
      req.user!.id
    );
    successResponse(res, supplier, "Ẩn nhà cung cấp thành công");
  }
);
