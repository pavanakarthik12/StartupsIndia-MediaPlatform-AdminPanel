import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table } from "@/components/ui/table";
import { useTopics, useTopicMutations } from "@/hooks/useTopics";
import type { Topic } from "@/types/topics";

export function Topics() {
  const { data = [] } = useTopics();
  const { upsert } = useTopicMutations();
  const [form, setForm] = useState<Partial<Topic>>({
    id: "",
    slug: "",
    title: "",
    description: "",
    icon: "",
    thumbnailUrl: "",
    isActive: true,
    sortOrder: 0
  });

  const handleSave = async () => {
    if (!form.slug) return;
    await upsert.mutateAsync({ id: form.slug, payload: form });
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Topics</h1>
        <p className="text-sm text-muted-foreground">Manage categories and interests used across the app.</p>
      </div>

      <Card>
        <div className="grid gap-3 md:grid-cols-3">
          <Input placeholder="Slug" value={form.slug ?? ""} onChange={(event) => setForm((prev) => ({ ...prev, slug: event.target.value }))} />
          <Input placeholder="Title" value={form.title ?? ""} onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))} />
          <Input placeholder="Description" value={form.description ?? ""} onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))} />
          <Input placeholder="Icon" value={form.icon ?? ""} onChange={(event) => setForm((prev) => ({ ...prev, icon: event.target.value }))} />
          <Input placeholder="Thumbnail URL" value={form.thumbnailUrl ?? ""} onChange={(event) => setForm((prev) => ({ ...prev, thumbnailUrl: event.target.value }))} />
          <Input
            placeholder="Sort Order"
            type="number"
            value={String(form.sortOrder ?? 0)}
            onChange={(event) => setForm((prev) => ({ ...prev, sortOrder: Number(event.target.value) }))}
          />
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <input
              type="checkbox"
              checked={Boolean(form.isActive)}
              onChange={(event) => setForm((prev) => ({ ...prev, isActive: event.target.checked }))}
            />
            Active
          </div>
          <Button type="button" onClick={handleSave}>
            Save Topic
          </Button>
        </div>
      </Card>

      <Card>
        <Table>
          <thead className="bg-muted text-left text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {data.map((topic) => (
              <tr key={topic.id} className="border-t border-border">
                <td className="px-4 py-3">{topic.slug}</td>
                <td className="px-4 py-3">{topic.title}</td>
                <td className="px-4 py-3">{topic.isActive ? "Active" : "Inactive"}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>
    </div>
  );
}
