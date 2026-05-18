export type CampaignStatus = "draft" | "scheduled" | "sent" | "failed";

export type NotificationCampaign = {
  id: string;
  title: string;
  body: string;
  targetType: "all" | "role" | "interest" | "topic" | "user";
  targetValue: string | string[];
  payload?: {
    page?: string;
    articleId?: string;
  };
  status: CampaignStatus;
  sentCount: number;
  createdAt?: unknown;
  sentAt?: unknown;
  scheduledAt?: unknown;
  deliveryRate?: number;
  opens?: number;
  clicks?: number;
  errorMessage?: string;
};
