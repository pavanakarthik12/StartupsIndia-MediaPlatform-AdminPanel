import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type Status = "active" | "suspended" | "deleted";

const styles: Record<Status, string> = {
  active: "border-emerald-500/40 text-emerald-600",
  suspended: "border-amber-500/40 text-amber-600",
  deleted: "border-rose-500/40 text-rose-600"
};

export function UserStatusBadge({ status }: { status: Status }) {
  return <Badge className={cn("border", styles[status])}>{status}</Badge>;
}
