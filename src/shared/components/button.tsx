import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@shared/utils/cn";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  children: ReactNode;
};

export function Button({
  variant = "secondary",
  className,
  children,
  ...props
}: ButtonProps) {
  const variants = {
    primary: "bg-ink text-white hover:bg-black",
    secondary: "border border-line bg-white text-ink hover:bg-slate-50",
    ghost: "text-slate-700 hover:bg-slate-100",
    danger: "border border-red-200 bg-red-50 text-red-700 hover:bg-red-100"
  };

  return (
    <button
      className={cn(
        "inline-flex h-9 items-center justify-center gap-2 rounded-md px-3 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
