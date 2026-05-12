import { Request, Response } from "express";
import { successResponse } from "../../common/utils/response";
import { asyncHandler } from "../../common/utils/async-handler";
import * as auditLogService from "./audit-log.service";

export const getAuditLogs = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await auditLogService.getAuditLogs(req.query as any);
    successResponse(res, result);
  }
);

export const getAuditLogById = asyncHandler(
  async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const log = await auditLogService.getAuditLogById(id);
    successResponse(res, log);
  }
);
