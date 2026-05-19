export type SourceProfile = {
  id: string;
  name: string;
  slug: string;
  avatarUrl: string;
  bio: string;
  websiteUrl: string;
  followersCount: number;
  newsCount: number;
  isVerified: boolean;
  isActive: boolean;
  createdAt?: unknown;
  updatedAt?: unknown;
};
