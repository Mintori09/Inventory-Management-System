"use client";

import { Drawer } from "@/components/ui/Drawer";
import { Badge } from "@/components/ui/Badge";
import { formatDateTime, formatCurrency } from "@/lib/format";
import { useMovement } from "@/hooks/useInventory";
import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";

const badgeVariant: Record<string, "success" | "info" | "warning"> = {
  import: "success", export: "info", adjustment: "warning",
};
const typeLabel: Record<string, string> = {
  import: "Nhập kho", export: "Xuất kho", adjustment: "Điều chỉnh",
};

type Props = {
  movementId: number | null;
  onClose: () => void;
};

export function MovementDetailDrawer({ movementId, onClose }: Props) {
  const { data: movement, isLoading } = useMovement(movementId || 0);

  return (
    <Drawer open={movementId !== null} onClose={onClose} title="Chi tiết giao dịch">
      {isLoading ? (
        <LoadingSkeleton className="h-8 w-full" count={6} />
      ) : movement ? (
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-500">Loại</p>
            <Badge variant={badgeVariant[movement.type]}>{typeLabel[movement.type]}</Badge>
          </div>
          <div>
            <p className="text-sm text-gray-500">Sản phẩm</p>
            <p className="font-medium">{movement.product.name} ({movement.product.sku})</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Số lượng thay đổi</p>
            <p className={movement.quantityChange > 0 ? "text-success font-medium" : "text-danger font-medium"}>
              {movement.quantityChange > 0 ? "+" : ""}{movement.quantityChange}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Tồn trước</p>
              <p className="font-medium">{movement.stockBefore}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Tồn sau</p>
              <p className="font-medium">{movement.stockAfter}</p>
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-500">Người thực hiện</p>
            <p className="font-medium">{movement.createdBy.fullName}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Thời gian</p>
            <p className="font-medium">{formatDateTime(movement.createdAt)}</p>
          </div>
          {movement.note && (
            <div>
              <p className="text-sm text-gray-500">Ghi chú</p>
              <p className="font-medium">{movement.note}</p>
            </div>
          )}
        </div>
      ) : null}
    </Drawer>
  );
}
