export type { AdminRole } from "@/constants/roles";

export type AuthUser = {
  uid: string;
  email: string;
  displayName: string;
};

export type TimestampValue = Date | string | number | null;
