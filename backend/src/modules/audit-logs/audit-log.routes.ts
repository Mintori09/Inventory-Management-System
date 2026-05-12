import { Router } from "express";
import { authMiddleware } from "../../common/middlewares/auth.middleware";
import { requireRole } from "../../common/middlewares/role.middleware";
import * as auditLogController from "./audit-log.controller";

const router = Router();

router.use(authMiddleware, requireRole("admin"));

/**
 * @openapi
 * /api/audit-logs:
 *   get:
 *     tags:
 *       - Audit Logs
 *     summary: Danh sách audit log (admin-only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: action
 *         schema:
 *           type: string
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
 *         description: Danh sách audit log
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 items:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/AuditLog'
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 */
router.get("/", auditLogController.getAuditLogs);

/**
 * @openapi
 * /api/audit-logs/{id}:
 *   get:
 *     tags:
 *       - Audit Logs
 *     summary: Chi tiết audit log (admin-only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Chi tiết audit log
 *       404:
 *         description: Không tìm thấy
 */
router.get("/:id", auditLogController.getAuditLogById);

export default router;
