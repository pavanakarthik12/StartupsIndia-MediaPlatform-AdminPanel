import { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Table } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { CommentStatusBadge } from "@/modules/moderation/CommentStatusBadge";
import { ArticleStatusBadge } from "@/modules/articles/ArticleStatusBadge";
import { UserStatusBadge } from "@/modules/users/UserStatusBadge";
import { useArticlesQuery, useArticleMutations } from "@/hooks/useArticles";
import { useCommentsQuery, useCommentMutations } from "@/hooks/useComments";
import { useUsersQuery } from "@/hooks/useUsers";
import type { CommentStatus } from "@/types/comments";

export function Moderation() {
  const { data: articles = [] } = useArticlesQuery();
  const { data: comments = [] } = useCommentsQuery();
  const { data: users = [] } = useUsersQuery();
  const { updateStatus: updateArticleStatus } = useArticleMutations();
  const { updateStatus: updateCommentStatus, remove: removeComment } = useCommentMutations();

  const pendingArticles = useMemo(() => articles.filter((item) => item.status === "pending"), [articles]);
  const reportedComments = useMemo(() => comments.filter((item) => item.status === "reported"), [comments]);
  const suspendedUsers = useMemo(
    () => users.filter((user) => (user.accountStatus ?? "active") === "suspended"),
    [users]
  );

  const handleCommentAction = async (commentPath: string, status: CommentStatus) => {
    await updateCommentStatus.mutateAsync({ path: commentPath, status });
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Moderation Center</h1>
        <p className="text-sm text-muted-foreground">Unified queue for content, users, and reports.</p>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <Card>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Pending Articles</p>
          <p className="mt-2 text-2xl font-semibold">{pendingArticles.length}</p>
        </Card>
        <Card>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Reported Comments</p>
          <p className="mt-2 text-2xl font-semibold">{reportedComments.length}</p>
        </Card>
        <Card>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Suspended Users</p>
          <p className="mt-2 text-2xl font-semibold">{suspendedUsers.length}</p>
        </Card>
      </div>

      <Card>
        <h2 className="text-base font-semibold">Pending Articles</h2>
        <Table>
          <thead className="bg-muted text-left text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Headline</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {pendingArticles.map((article) => (
              <tr key={article.id} className="border-t border-border">
                <td className="px-4 py-3">{article.headline}</td>
                <td className="px-4 py-3">{article.category}</td>
                <td className="px-4 py-3">
                  <ArticleStatusBadge status={article.status ?? "pending"} />
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2 text-xs">
                    <button
                      className="text-primary"
                      onClick={() => updateArticleStatus.mutateAsync({ id: article.id, status: "published" })}
                    >
                      Approve
                    </button>
                    <button
                      className="text-muted-foreground"
                      onClick={() => updateArticleStatus.mutateAsync({ id: article.id, status: "rejected" })}
                    >
                      Reject
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>

      <Card>
        <h2 className="text-base font-semibold">Reported Comments</h2>
        <Table>
          <thead className="bg-muted text-left text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Comment</th>
              <th className="px-4 py-3">User</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {reportedComments.map((comment) => (
              <tr key={comment.id} className="border-t border-border">
                <td className="px-4 py-3">{comment.text}</td>
                <td className="px-4 py-3">{comment.userName}</td>
                <td className="px-4 py-3">
                  <CommentStatusBadge status={comment.status} />
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2 text-xs">
                    <button
                      className="text-primary"
                      onClick={() => comment.path && handleCommentAction(comment.path, "hidden")}
                      disabled={!comment.path}
                    >
                      Hide
                    </button>
                    <button
                      className="text-muted-foreground"
                      onClick={() => comment.path && handleCommentAction(comment.path, "visible")}
                      disabled={!comment.path}
                    >
                      Restore
                    </button>
                    <button
                      className="text-muted-foreground"
                      onClick={() => comment.path && removeComment.mutateAsync(comment.path)}
                      disabled={!comment.path}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>

      <Card>
        <h2 className="text-base font-semibold">Suspended Users</h2>
        <Table>
          <thead className="bg-muted text-left text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-3">User</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {suspendedUsers.map((user) => (
              <tr key={user.uid} className="border-t border-border">
                <td className="px-4 py-3">{user.displayName || user.fullName}</td>
                <td className="px-4 py-3">{user.email}</td>
                <td className="px-4 py-3">
                  <UserStatusBadge status={user.accountStatus ?? "suspended"} />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>
    </div>
  );
}
