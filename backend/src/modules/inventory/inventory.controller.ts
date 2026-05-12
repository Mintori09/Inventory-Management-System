import { Request, Response } from "express";
import { successResponse } from "../../common/utils/response";
import { asyncHandler } from "../../common/utils/async-handler";
import { Parser } from "json2csv";
import * as inventoryService from "./inventory.service";

export const getStockOverview = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await inventoryService.getStockOverview(req.query as any);
    successResponse(res, result);
  }
);

export const importStock = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await inventoryService.importStock(req.body, req.user!.id);
    successResponse(res, result, "Nhập kho thành công", 201);
  }
);

export const exportStock = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await inventoryService.exportStock(req.body, req.user!.id);
    successResponse(res, result, "Xuất kho thành công", 201);
  }
);

export const adjustStock = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await inventoryService.adjustStock(req.body, req.user!.id);
    successResponse(res, result, "Điều chỉnh kho thành công", 201);
  }
);

export const getMovements = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await inventoryService.getMovements(req.query as any);
    successResponse(res, result);
  }
);

export const getLowStock = asyncHandler(
  async (_req: Request, res: Response) => {
    const result = await inventoryService.getLowStockProducts();
    successResponse(res, result);
  }
);

export const getStatistics = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await inventoryService.getStockStatistics(req.query as any);
    successResponse(res, result);
  }
);

export const exportCsv = asyncHandler(
  async (_req: Request, res: Response) => {
    const overview = await inventoryService.getStockOverview({});
    const fields = [
      { label: "SKU", value: "sku" },
      { label: "Tên sản phẩm", value: "name" },
      { label: "Danh mục", value: "categoryName" },
      { label: "Tồn kho", value: "currentStock" },
      { label: "Tồn tối thiểu", value: "minStock" },
      { label: "Đơn vị", value: "unit" },
      { label: "Trạng thái", value: "stockStatus" },
    ];
    const parser = new Parser({ fields });
    const csv = parser.parse(overview.items);
    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=inventory-export.csv"
    );
    res.send("\ufeff" + csv);
  }
);
