"use client";

import { cn } from "@/lib/utils";

export type SelectOption = { value: string | number; label: string };

type SelectProps = {
  label?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
} & React.SelectHTMLAttributes<HTMLSelectElement>;

export function Select({ label, error, options, placeholder, className, id, ...props }: SelectProps) {
  const selectId = id || label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={selectId} className="text-sm font-medium text-foreground">
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={cn(
          "rounded-lg border border-gray-300 px-3 py-2 text-sm transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50",
          error && "border-danger focus:border-danger focus:ring-danger/50",
          className
        )}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={String(opt.value)} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  );
}
