import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getStaticPage, listStaticPages, upsertStaticPage } from "@/services/staticPages";
import type { StaticPage } from "@/types/staticPages";

export function useStaticPages() {
  return useQuery({
    queryKey: ["static_pages"],
    queryFn: listStaticPages
  });
}

export function useStaticPage(slug: string | undefined) {
  return useQuery({
    queryKey: ["static_pages", slug],
    queryFn: () => (slug ? getStaticPage(slug) : Promise.resolve(null)),
    enabled: Boolean(slug)
  });
}

export function useStaticPageMutations() {
  const client = useQueryClient();

  const upsert = useMutation({
    mutationFn: ({ slug, payload }: { slug: string; payload: Partial<StaticPage> }) => upsertStaticPage(slug, payload),
    onSuccess: () => client.invalidateQueries({ queryKey: ["static_pages"] })
  });

  return { upsert };
}
