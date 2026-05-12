import { cn } from "@/lib/utils";

type Column<T> = {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
  className?: string;
};

type TableProps<T> = {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (item: T) => void;
  isLoading?: boolean;
  skeletonRows?: number;
};

export function Table<T extends { id: number | string }>({
  columns,
  data,
  onRowClick,
  isLoading,
  skeletonRows = 5,
}: TableProps<T>) {
  if (isLoading) {
    return (
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((col) => (
                <th key={col.key} className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="animate-pulse divide-y divide-gray-200">
            {Array.from({ length: skeletonRows }).map((_, i) => (
              <tr key={i}>
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-3">
                    <div className="h-4 w-3/4 rounded bg-gray-200" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (data.length === 0) return null;

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((col) => (
              <th key={col.key} className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {data.map((item) => (
            <tr
              key={item.id}
              className={cn(
                "transition-colors hover:bg-gray-50",
                onRowClick && "cursor-pointer"
              )}
              onClick={() => onRowClick?.(item)}
            >
              {columns.map((col) => (
                <td key={col.key} className="whitespace-nowrap px-4 py-3 text-sm text-foreground">
                  {col.render ? col.render(item) : String((item as any)[col.key] ?? "")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
