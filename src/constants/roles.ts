export const adminRoles = ["user", "author", "moderator", "admin"] as const;
export type AdminRole = (typeof adminRoles)[number];

export const publishRoles: AdminRole[] = ["moderator", "admin"];
