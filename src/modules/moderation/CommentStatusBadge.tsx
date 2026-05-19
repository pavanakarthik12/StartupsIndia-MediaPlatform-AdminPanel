import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { CommentStatus } from "@/types/comments";

const styles: Record<CommentStatus, string> = {
  visible: "border-emerald-500/40 text-emerald-600",
  hidden: "border-amber-500/40 text-amber-600",
  deleted: "border-rose-500/40 text-rose-600",
  reported: "border-slate-500/40 text-slate-500"
};

export function CommentStatusBadge({ status }: { status: CommentStatus }) {
  return <Badge className={cn("border", styles[status])}>{status}</Badge>;
}
