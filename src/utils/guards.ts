import type { AdminRole } from "@/constants/roles";
import { publishRoles } from "@/constants/roles";

export function canPublish(role: AdminRole) {
  return publishRoles.includes(role);
}
