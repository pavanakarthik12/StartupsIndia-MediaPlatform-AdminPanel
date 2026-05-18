import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { listTopics, upsertTopic } from "@/services/topics";
import type { Topic } from "@/types/topics";

export function useTopics() {
  return useQuery({
    queryKey: ["topics"],
    queryFn: listTopics
  });
}

export function useTopicMutations() {
  const client = useQueryClient();

  const upsert = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<Topic> }) => upsertTopic(id, payload),
    onSuccess: () => client.invalidateQueries({ queryKey: ["topics"] })
  });

  return { upsert };
}
