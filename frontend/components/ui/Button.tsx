"use client";

import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

type ButtonProps = {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "success";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  disabled?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const variantStyles: Record<string, string> = {
  primary: "bg-primary text-white hover:bg-primary-dark",
  secondary: "bg-secondary text-white hover:bg-secondary/80",
  outline: "border border-gray-300 text-foreground hover:bg-gray-50",
  ghost: "text-foreground hover:bg-gray-100",
  danger: "bg-danger text-white hover:bg-danger/80",
  success: "bg-success text-white hover:bg-success/80",
};

const sizeStyles: Record<string, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-sm",
  lg: "px-6 py-3 text-base",
};

export function Button({
  variant = "primary",
  size = "md",
  isLoading = false,
  disabled = false,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:cursor-not-allowed disabled:opacity-50",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
}
