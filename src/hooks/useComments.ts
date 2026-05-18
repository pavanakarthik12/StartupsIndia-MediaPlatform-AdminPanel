import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteComment, listComments, updateCommentStatus } from "@/services/comments";
import type { CommentStatus } from "@/types/comments";

export function useCommentsQuery() {
  return useQuery({
    queryKey: ["comments"],
    queryFn: listComments
  });
}

export function useCommentMutations() {
  const client = useQueryClient();

  const updateStatus = useMutation({
    mutationFn: ({ path, status }: { path: string; status: CommentStatus }) => updateCommentStatus(path, status),
    onSuccess: () => client.invalidateQueries({ queryKey: ["comments"] })
  });

  const remove = useMutation({
    mutationFn: (path: string) => deleteComment(path),
    onSuccess: () => client.invalidateQueries({ queryKey: ["comments"] })
  });

  return { updateStatus, remove };
}
