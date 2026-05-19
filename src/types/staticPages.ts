export type StaticPageStatus = "draft" | "published";

export type StaticPage = {
  slug: string;
  title: string;
  body: string;
  status: StaticPageStatus;
  seoTitle?: string;
  seoDescription?: string;
  updatedAt?: unknown;
  publishedAt?: unknown;
};
