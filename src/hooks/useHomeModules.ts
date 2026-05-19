import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createHomeModule, deleteHomeModule, listHomeModule, updateHomeModule } from "@/services/homeModules";

export function useHomeModule<T>(collectionName: string) {
  const client = useQueryClient();

  const query = useQuery({
    queryKey: [collectionName],
    queryFn: () => listHomeModule<T>(collectionName)
  });

  const create = useMutation({
    mutationFn: (payload: Partial<T>) => createHomeModule<T>(collectionName, payload),
    onSuccess: () => client.invalidateQueries({ queryKey: [collectionName] })
  });

  const update = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<T> }) => updateHomeModule<T>(collectionName, id, payload),
    onSuccess: () => client.invalidateQueries({ queryKey: [collectionName] })
  });

  const remove = useMutation({
    mutationFn: (id: string) => deleteHomeModule(collectionName, id),
    onSuccess: () => client.invalidateQueries({ queryKey: [collectionName] })
  });

  return { query, create, update, remove };
}
