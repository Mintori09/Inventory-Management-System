import { Request, Response } from "express";
import { successResponse } from "../../common/utils/response";
import { asyncHandler } from "../../common/utils/async-handler";
import * as dashboardService from "./dashboard.service";

export const getSummary = asyncHandler(
  async (_req: Request, res: Response) => {
    const summary = await dashboardService.getSummary();
    successResponse(res, summary);
  }
);

export const getRecentMovements = asyncHandler(
  async (_req: Request, res: Response) => {
    const movements = await dashboardService.getRecentMovements();
    successResponse(res, movements);
  }
);
