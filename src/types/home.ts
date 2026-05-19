export type HomeBanner = {
  id: string;
  badge: string;
  headline: string;
  highlightLine: string;
  subtitle: string;
  ctaLabel?: string;
  ctaLink?: string;
  redirectUrl?: string;
  imageUrl?: string;
  gradientStart?: string;
  gradientEnd?: string;
  isActive: boolean;
  sortOrder: number;
  publishStart?: unknown;
  publishEnd?: unknown;
  createdAt?: unknown;
  updatedAt?: unknown;
};

export type HomeEvent = {
  id: string;
  title: string;
  description?: string;
  location: string;
  eventDate: string;
  eventTime?: string;
  registrationLink?: string;
  category?: string;
  imageUrl?: string;
  isActive: boolean;
  sortOrder: number;
  publishStart?: unknown;
  publishEnd?: unknown;
  createdAt?: unknown;
  updatedAt?: unknown;
};

export type HomeCourse = {
  id: string;
  title: string;
  instructor?: string;
  difficulty?: string;
  tags?: string[];
  courseLink?: string;
  thumbnailUrl?: string;
  duration?: string;
  category?: string;
  isFeatured?: boolean;
  isActive: boolean;
  sortOrder: number;
  publishStart?: unknown;
  publishEnd?: unknown;
  createdAt?: unknown;
  updatedAt?: unknown;
};

export type HomeCommunity = {
  id: string;
  name: string;
  description?: string;
  logoUrl?: string;
  inviteLink?: string;
  memberCount?: string;
  isActive: boolean;
  sortOrder: number;
  publishStart?: unknown;
  publishEnd?: unknown;
  createdAt?: unknown;
  updatedAt?: unknown;
};

export type HomeLeaderEntry = {
  id: string;
  rank: number;
  name: string;
  sector?: string;
  valuation?: string;
  growth?: string;
  rankingType?: "startup" | "creator";
  period?: "weekly" | "monthly" | "all_time";
  score?: number;
  isActive: boolean;
  sortOrder: number;
  publishStart?: unknown;
  publishEnd?: unknown;
  createdAt?: unknown;
  updatedAt?: unknown;
};

export type HomeFundingCard = {
  id: string;
  company: string;
  stage?: string;
  amount?: string;
  sector?: string;
  description?: string;
  imageUrl?: string;
  isActive: boolean;
  sortOrder: number;
  publishStart?: unknown;
  publishEnd?: unknown;
  createdAt?: unknown;
  updatedAt?: unknown;
};
