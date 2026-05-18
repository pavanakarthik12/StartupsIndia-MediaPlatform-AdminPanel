export type CommentStatus = "visible" | "hidden" | "deleted" | "reported";

export type Comment = {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  text: string;
  parentId: string | null;
  likesCount: number;
  likedBy: string[];
  status: CommentStatus;
  createdAt?: unknown;
  updatedAt?: unknown;
};
