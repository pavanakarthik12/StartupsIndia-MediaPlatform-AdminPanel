export type Topic = {
  id: string;
  slug: string;
  title: string;
  description: string;
  icon: string;
  thumbnailUrl: string;
  isActive: boolean;
  sortOrder: number;
  createdAt?: unknown;
  updatedAt?: unknown;
};
