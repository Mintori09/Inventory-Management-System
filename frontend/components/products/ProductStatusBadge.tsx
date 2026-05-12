import { Badge } from "@/components/ui/Badge";
import { getStockStatusLabel } from "@/lib/format";
import type { StockStatus } from "@/types/product.type";

const badgeMap: Record<StockStatus, "success" | "warning" | "danger"> = {
  in_stock: "success",
  low_stock: "warning",
  out_of_stock: "danger",
};

export function ProductStatusBadge({ status }: { status: StockStatus }) {
  return <Badge variant={badgeMap[status]}>{getStockStatusLabel(status)}</Badge>;
}
