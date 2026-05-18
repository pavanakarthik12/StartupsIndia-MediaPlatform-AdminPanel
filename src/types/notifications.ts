export type CampaignStatus = "draft" | "sent" | "failed";

export type NotificationCampaign = {
  id: string;
  title: string;
  body: string;
  targetType: "all" | "role" | "interest" | "user";
  targetValue: string | string[];
  payload?: {
    page?: string;
    articleId?: string;
  };
  status: CampaignStatus;
  sentCount: number;
  createdAt?: unknown;
  sentAt?: unknown;
};
