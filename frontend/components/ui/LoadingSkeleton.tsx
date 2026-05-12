import { cn } from "@/lib/utils";

type LoadingSkeletonProps = {
  className?: string;
  count?: number;
};

export function LoadingSkeleton({ className, count = 1 }: LoadingSkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={cn("animate-pulse rounded-lg bg-gray-200", className)}
        />
      ))}
    </>
  );
}
