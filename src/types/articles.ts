export type ArticleStatus = "draft" | "pending" | "published" | "rejected" | "archived";

export type ModerationEntry = {
  action: "submitted" | "approved" | "rejected" | "archived" | "restored";
  by: string;
  at: unknown;
  reason?: string;
};

export type Article = {
  id: string;
  authorId: string;
  category: string;
  headline: string;
  sourceName: string;
  sourceId: string;
  sourceLogoAsset: string;
  thumbnailAsset: string;
  timeAgo: string;
  body: string;
  likesCount: number;
  commentsCount: number;
  isSourceFollowing: boolean;
  isBookmarked: boolean;
  isLiked: boolean;
  isTrending: boolean;
  isFeatured?: boolean;
  likedBy: string[];
  bookmarkedBy: string[];
  createdAt: unknown;
  updatedAt: unknown;
  status?: ArticleStatus;
  publishedAt?: unknown | null;
  reviewedBy?: string | null;
  reviewedAt?: unknown | null;
  rejectionReason?: string | null;
  moderationHistory?: ModerationEntry[];
  scheduledAt?: unknown | null;
  mediaType?: "image" | "video";
  mediaUrl?: string;
  thumbnailUrl?: string;
  readTimeMinutes?: number;
  shareCount?: number;
  saveCount?: number;
};
