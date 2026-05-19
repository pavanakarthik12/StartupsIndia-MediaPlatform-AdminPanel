import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function SourceStatusBadge({ isVerified, isActive }: { isVerified: boolean; isActive: boolean }) {
  const style = isVerified ? "border-emerald-500/40 text-emerald-600" : "border-amber-500/40 text-amber-600";
  const activeStyle = isActive ? "border-sky-500/40 text-sky-600" : "border-rose-500/40 text-rose-600";

  return (
    <div className="flex flex-wrap gap-2">
      <Badge className={cn("border", style)}>{isVerified ? "verified" : "unverified"}</Badge>
      <Badge className={cn("border", activeStyle)}>{isActive ? "active" : "inactive"}</Badge>
    </div>
  );
}
