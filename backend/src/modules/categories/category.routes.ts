import { Router } from "express";
import { authMiddleware } from "../../common/middlewares/auth.middleware";
import { requireRole } from "../../common/middlewares/role.middleware";
import { validate } from "../../common/middlewares/validate.middleware";
import {
  createCategorySchema,
  updateCategorySchema,
} from "./category.schema";
import * as categoryController from "./category.controller";

const router = Router();

router.use(authMiddleware);

/**
 * @openapi
 * /api/categories:
 *   get:
 *     tags:
 *       - Categories
 *     summary: Danh sách danh mục
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách danh mục
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Category'
 */
router.get("/", categoryController.getCategories);
router.get("/:id", categoryController.getCategoryById);

/**
 * @openapi
 * /api/categories:
 *   post:
 *     tags:
 *       - Categories
 *     summary: Tạo danh mục (admin-only)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateCategoryInput'
 *     responses:
 *       201:
 *         description: Tạo danh mục thành công
 *       400:
 *         description: Tên danh mục đã tồn tại
 *       422:
 *         description: Dữ liệu không hợp lệ
 */
router.post(
  "/",
  requireRole("admin"),
  validate(createCategorySchema),
  categoryController.createCategory
);

/**
 * @openapi
 * /api/categories/{id}:
 *   put:
 *     tags:
 *       - Categories
 *     summary: Cập nhật danh mục (admin-only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateCategoryInput'
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 */
router.put(
  "/:id",
  requireRole("admin"),
  validate(updateCategorySchema),
  categoryController.updateCategory
);
router.delete("/:id", requireRole("admin"), categoryController.deactivateCategory);

export default router;
