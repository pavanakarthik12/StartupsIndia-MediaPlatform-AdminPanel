import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Modal({
  open,
  onClose,
  title,
  children,
  className
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  className?: string;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className={cn("w-full max-w-lg rounded-xl border border-border bg-card p-6 shadow-soft", className)}>
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold">{title}</h2>
          <button className="text-xs text-muted-foreground" onClick={onClose}>
            Close
          </button>
        </div>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}
