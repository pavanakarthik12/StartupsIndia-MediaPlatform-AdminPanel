import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createSource, deleteSource, getSourceById, listSources, updateSource } from "@/services/sources";
import type { SourceProfile } from "@/types/sources";

export function useSourcesQuery() {
  return useQuery({
    queryKey: ["sources"],
    queryFn: listSources
  });
}

export function useSourceQuery(id: string | undefined) {
  return useQuery({
    queryKey: ["sources", id],
    queryFn: () => (id ? getSourceById(id) : Promise.resolve(null)),
    enabled: Boolean(id)
  });
}

export function useSourceMutations() {
  const client = useQueryClient();

  const create = useMutation({
    mutationFn: (payload: Partial<SourceProfile>) => createSource(payload),
    onSuccess: () => client.invalidateQueries({ queryKey: ["sources"] })
  });

  const update = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<SourceProfile> }) => updateSource(id, payload),
    onSuccess: () => client.invalidateQueries({ queryKey: ["sources"] })
  });

  const remove = useMutation({
    mutationFn: (id: string) => deleteSource(id),
    onSuccess: () => client.invalidateQueries({ queryKey: ["sources"] })
  });

  return { create, update, remove };
}
