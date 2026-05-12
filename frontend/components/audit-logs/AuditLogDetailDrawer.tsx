"use client";

import { Drawer } from "@/components/ui/Drawer";
import { Badge } from "@/components/ui/Badge";
import { formatDateTime } from "@/lib/format";
import { useAuditLog } from "@/hooks/useAuditLogs";
import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";

type Props = {
  logId: number | null;
  onClose: () => void;
};

export function AuditLogDetailDrawer({ logId, onClose }: Props) {
  const { data: log, isLoading } = useAuditLog(logId || 0);

  return (
    <Drawer open={logId !== null} onClose={onClose} title="Chi tiết nhật ký">
      {isLoading ? (
        <LoadingSkeleton className="h-8 w-full" count={6} />
      ) : log ? (
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-500">Hành động</p>
            <Badge variant="info">{log.action}</Badge>
          </div>
          <div>
            <p className="text-sm text-gray-500">Người thực hiện</p>
            <p className="font-medium">{log.user.fullName}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Bảng / Record ID</p>
            <p className="font-medium">{log.tableName} #{log.recordId}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Mô tả</p>
            <p className="font-medium">{log.description}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Thời gian</p>
            <p className="font-medium">{formatDateTime(log.createdAt)}</p>
          </div>
          {log.oldValues && (
            <div>
              <p className="text-sm text-gray-500">Giá trị cũ</p>
              <pre className="mt-1 max-h-40 overflow-auto rounded bg-gray-50 p-2 text-xs">
                {JSON.stringify(log.oldValues, null, 2)}
              </pre>
            </div>
          )}
          {log.newValues && (
            <div>
              <p className="text-sm text-gray-500">Giá trị mới</p>
              <pre className="mt-1 max-h-40 overflow-auto rounded bg-gray-50 p-2 text-xs">
                {JSON.stringify(log.newValues, null, 2)}
              </pre>
            </div>
          )}
        </div>
      ) : null}
    </Drawer>
  );
}
