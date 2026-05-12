import { Router } from "express";
import { authMiddleware } from "../../common/middlewares/auth.middleware";
import * as dashboardController from "./dashboard.controller";

const router = Router();

router.use(authMiddleware);

/**
 * @openapi
 * /api/dashboard/summary:
 *   get:
 *     tags:
 *       - Dashboard
 *     summary: Thống kê dashboard
 *     description: Tổng số sản phẩm, số lượng tồn thấp/hết hàng, nhập/xuất hôm nay, giá trị tồn kho
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Thống kê dashboard
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/DashboardSummary'
 */
router.get("/summary", dashboardController.getSummary);

/**
 * @openapi
 * /api/dashboard/recent-movements:
 *   get:
 *     tags:
 *       - Dashboard
 *     summary: Giao dịch gần đây
 *     description: 10 giao dịch kho mới nhất
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách giao dịch gần đây
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/StockMovement'
 */
router.get("/recent-movements", dashboardController.getRecentMovements);

export default router;
