"use client";

import { cn } from "@/lib/utils";

type TextareaProps = {
  label?: string;
  error?: string;
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export function Textarea({ label, error, className, id, ...props }: TextareaProps) {
  const textareaId = id || label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={textareaId} className="text-sm font-medium text-foreground">
          {label}
        </label>
      )}
      <textarea
        id={textareaId}
        className={cn(
          "rounded-lg border border-gray-300 px-3 py-2 text-sm transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50",
          error && "border-danger focus:border-danger focus:ring-danger/50",
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  );
}
