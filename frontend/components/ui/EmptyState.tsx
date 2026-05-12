import { cn } from "@/lib/utils";

type EmptyStateProps = {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
  className?: string;
};

export function EmptyState({ title, description, actionLabel, onAction, icon, className }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-16 text-center", className)}>
      {icon && <div className="mb-4 text-gray-400">{icon}</div>}
      <h3 className="text-lg font-medium text-foreground">{title}</h3>
      {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="mt-4 text-sm font-medium text-primary hover:text-primary-dark"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
