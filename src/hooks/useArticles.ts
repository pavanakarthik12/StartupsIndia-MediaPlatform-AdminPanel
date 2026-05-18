import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { bulkUpdateStatus, createArticle, deleteArticle, getArticleById, listArticles, updateArticleStatus, upsertArticle } from "@/services/articles";
import type { Article, ArticleStatus } from "@/types/articles";

export function useArticlesQuery() {
  return useQuery({
    queryKey: ["articles"],
    queryFn: listArticles
  });
}

export function useArticleQuery(id: string | undefined) {
  return useQuery({
    queryKey: ["articles", id],
    queryFn: () => (id ? getArticleById(id) : Promise.resolve(null)),
    enabled: Boolean(id)
  });
}

export function useArticleMutations() {
  const client = useQueryClient();

  const create = useMutation({
    mutationFn: (payload: Partial<Article>) => createArticle(payload),
    onSuccess: () => client.invalidateQueries({ queryKey: ["articles"] })
  });

  const upsert = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<Article> }) => upsertArticle(id, payload),
    onSuccess: () => client.invalidateQueries({ queryKey: ["articles"] })
  });

  const updateStatus = useMutation({
    mutationFn: ({ id, status, meta }: { id: string; status: ArticleStatus; meta?: Partial<Article> }) =>
      updateArticleStatus(id, status, meta),
    onSuccess: () => client.invalidateQueries({ queryKey: ["articles"] })
  });

  const remove = useMutation({
    mutationFn: (id: string) => deleteArticle(id),
    onSuccess: () => client.invalidateQueries({ queryKey: ["articles"] })
  });

  const bulkStatus = useMutation({
    mutationFn: ({ ids, status, meta }: { ids: string[]; status: ArticleStatus; meta?: Partial<Article> }) =>
      bulkUpdateStatus(ids, status, meta),
    onSuccess: () => client.invalidateQueries({ queryKey: ["articles"] })
  });

  return { create, upsert, updateStatus, remove, bulkStatus };
}
