import { Badge } from "@/components/ui/badge";
import type { ArticleStatus } from "@/types/articles";
import { cn } from "@/lib/utils";

const statusStyles: Record<ArticleStatus, string> = {
  draft: "border-muted-foreground/40 text-muted-foreground",
  pending: "border-amber-500/40 text-amber-600",
  published: "border-emerald-500/40 text-emerald-600",
  rejected: "border-rose-500/40 text-rose-600",
  archived: "border-slate-500/40 text-slate-500"
};

export function ArticleStatusBadge({ status }: { status: ArticleStatus }) {
  return <Badge className={cn("border", statusStyles[status])}>{status}</Badge>;
}
