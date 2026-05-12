import { Prisma } from "@prisma/client";
import { BadRequestError } from "../errors/BadRequestError";
import { NotFoundError } from "../errors/NotFoundError";

export function handlePrismaError(err: Prisma.PrismaClientKnownRequestError) {
  switch (err.code) {
    case "P2002": {
      const target = (err.meta?.target as string[])?.join(", ") || "";
      const field = target || "field";
      throw new BadRequestError(`${field} đã tồn tại`);
    }
    case "P2025":
      throw new NotFoundError("Bản ghi không tồn tại");
    case "P2003": {
      const field = (err.meta?.field_name as string) || "foreign key";
      throw new BadRequestError(`Dữ liệu tham chiếu không hợp lệ: ${field}`);
    }
    case "P2014":
      throw new BadRequestError("Vi phạm ràng buộc quan hệ");
    default:
      throw err;
  }
}
