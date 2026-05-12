import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";

type StatCardProps = {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: { value: number; isUp: boolean };
  className?: string;
};

export function StatCard({ title, value, icon, trend, className }: StatCardProps) {
  return (
    <div className={cn("rounded-xl border border-gray-200 bg-white p-6", className)}>
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-500">{title}</p>
        {icon && <div className="text-gray-400">{icon}</div>}
      </div>
      <p className="mt-2 text-2xl font-bold text-foreground">{value}</p>
      {trend && (
        <div className="mt-2 flex items-center gap-1 text-sm">
          {trend.isUp ? (
            <TrendingUp className="h-4 w-4 text-success" />
          ) : (
            <TrendingDown className="h-4 w-4 text-danger" />
          )}
          <span className={trend.isUp ? "text-success" : "text-danger"}>
            {trend.value}%
          </span>
        </div>
      )}
    </div>
  );
}
