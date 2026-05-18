import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createCampaign, listNotificationCampaigns, updateCampaign } from "@/services/notifications";
import type { NotificationCampaign } from "@/types/notifications";

export function useNotificationCampaigns() {
  return useQuery({
    queryKey: ["notification_campaigns"],
    queryFn: listNotificationCampaigns
  });
}

export function useNotificationMutations() {
  const client = useQueryClient();

  const create = useMutation({
    mutationFn: (payload: Partial<NotificationCampaign>) => createCampaign(payload),
    onSuccess: () => client.invalidateQueries({ queryKey: ["notification_campaigns"] })
  });

  const update = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<NotificationCampaign> }) => updateCampaign(id, payload),
    onSuccess: () => client.invalidateQueries({ queryKey: ["notification_campaigns"] })
  });

  return { create, update };
}
