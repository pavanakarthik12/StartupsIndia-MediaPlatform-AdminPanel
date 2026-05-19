import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Table({ className, ...props }: HTMLAttributes<HTMLTableElement>) {
  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <table className={cn("min-w-full text-sm", className)} {...props} />
    </div>
  );
}
