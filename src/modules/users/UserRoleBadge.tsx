import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type Role = "user" | "author" | "moderator" | "admin";

const styles: Record<Role, string> = {
  user: "border-slate-500/40 text-slate-500",
  author: "border-sky-500/40 text-sky-600",
  moderator: "border-amber-500/40 text-amber-600",
  admin: "border-rose-500/40 text-rose-600"
};

export function UserRoleBadge({ role }: { role: Role }) {
  return <Badge className={cn("border", styles[role])}>{role}</Badge>;
}
