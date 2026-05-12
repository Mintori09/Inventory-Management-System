import { Router } from "express";
import { authMiddleware } from "../../common/middlewares/auth.middleware";
import { requireRole } from "../../common/middlewares/role.middleware";
import { validate } from "../../common/middlewares/validate.middleware";
import {
  importStockSchema,
  exportStockSchema,
  adjustStockSchema,
} from "./inventory.schema";
import * as inventoryController from "./inventory.controller";

const router = Router();

router.use(authMiddleware);

/**
 * @openapi
 * /api/inventory/stock-overview:
 *   get:
 *     tags:
 *       - Inventory
 *     summary: Tổng quan tồn kho
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: categoryId
 *         schema:
 *           type: integer
 *       - in: query
 *         name: stockStatus
 *         schema:
 *           type: string
 *           enum: [in_stock, low_stock, out_of_stock]
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Tổng quan tồn kho
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 items:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/StockOverview'
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 */
router.get("/stock-overview", inventoryController.getStockOverview);

/**
 * @openapi
 * /api/inventory/movements:
 *   get:
 *     tags:
 *       - Inventory
 *     summary: Lịch sử giao dịch kho
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: productId
 *         schema:
 *           type: integer
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [import, export, adjustment]
 *       - in: query
 *         name: userId
 *         schema:
 *           type: integer
 *       - in: query
 *         name: from
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: to
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Lịch sử giao dịch
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 items:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/StockMovement'
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 */
router.get("/movements", inventoryController.getMovements);

/**
 * @openapi
 * /api/inventory/low-stock:
 *   get:
 *     tags:
 *       - Inventory
 *     summary: Sản phẩm sắp hết hàng
 *     description: Trả về sản phẩm có currentStock <= minStock (bao gồm out_of_stock và low_stock)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách sản phẩm tồn thấp
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 */
router.get("/low-stock", inventoryController.getLowStock);

/**
 * @openapi
 * /api/inventory/statistics:
 *   get:
 *     tags:
 *       - Inventory
 *     summary: Thống kê nhập xuất kho
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: from
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: to
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: groupBy
 *         schema:
 *           type: string
 *           enum: [day, month]
 *     responses:
 *       200:
 *         description: Thống kê nhập xuất
 */
router.get("/statistics", inventoryController.getStatistics);

/**
 * @openapi
 * /api/inventory/export:
 *   get:
 *     tags:
 *       - Inventory
 *     summary: Xuất CSV tồn kho
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: File CSV
 *         content:
 *           text/csv:
 *             schema:
 *               type: string
 */
router.get("/export", inventoryController.exportCsv);

/**
 * @openapi
 * /api/inventory/import:
 *   post:
 *     tags:
 *       - Inventory
 *     summary: Nhập kho
 *     description: Tăng tồn kho, ghi stock_movements và audit_logs trong transaction
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ImportStockInput'
 *     responses:
 *       201:
 *         description: Nhập kho thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/ImportResult'
 *       400:
 *         description: Sản phẩm không tồn tại
 */
router.post(
  "/import",
  validate(importStockSchema),
  inventoryController.importStock
);

/**
 * @openapi
 * /api/inventory/export:
 *   post:
 *     tags:
 *       - Inventory
 *     summary: Xuất kho
 *     description: Giảm tồn kho, kiểm tra đủ hàng, ghi stock_movements và audit_logs trong transaction
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ExportStockInput'
 *     responses:
 *       201:
 *         description: Xuất kho thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/ExportResult'
 *       400:
 *         description: Không đủ tồn kho
 */
router.post(
  "/export",
  validate(exportStockSchema),
  inventoryController.exportStock
);

/**
 * @openapi
 * /api/inventory/adjust:
 *   post:
 *     tags:
 *       - Inventory
 *     summary: Điều chỉnh kho (admin-only)
 *     description: Tăng/giảm tồn kho thủ công, ghi stock_movements và audit_logs trong transaction
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AdjustStockInput'
 *     responses:
 *       201:
 *         description: Điều chỉnh kho thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/AdjustResult'
 *       400:
 *         description: Không đủ tồn kho
 *       403:
 *         description: Chỉ admin mới được điều chỉnh kho
 */
router.post(
  "/adjust",
  requireRole("admin"),
  validate(adjustStockSchema),
  inventoryController.adjustStock
);

export default router;
