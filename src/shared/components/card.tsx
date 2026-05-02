import type { ReactNode } from "react";
import { cn } from "@shared/utils/cn";

export function Card({
  children,
  className
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("rounded-lg border border-line bg-white p-4 shadow-sm", className)}>
      {children}
    </section>
  );
}
