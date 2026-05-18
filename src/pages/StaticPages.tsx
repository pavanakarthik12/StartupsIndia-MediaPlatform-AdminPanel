import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MarkdownEditor } from "@/modules/articles/MarkdownEditor";
import { useStaticPages, useStaticPageMutations } from "@/hooks/useStaticPages";
import type { StaticPage, StaticPageStatus } from "@/types/staticPages";
import { useToast } from "@/hooks/useToast";

const defaultPages: Array<{ slug: string; title: string }> = [
  { slug: "privacy-policy", title: "Privacy Policy" },
  { slug: "terms-of-service", title: "Terms of Service" },
  { slug: "help", title: "Help" },
  { slug: "about", title: "About" }
];

export function StaticPages() {
  const { data = [] } = useStaticPages();
  const { upsert } = useStaticPageMutations();
  const { push } = useToast();
  const [activeSlug, setActiveSlug] = useState("privacy-policy");
  const [status, setStatus] = useState<StaticPageStatus>("draft");
  const [title, setTitle] = useState("");
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [body, setBody] = useState("");

  const page = useMemo(() => {
    return data.find((item) => item.slug === activeSlug);
  }, [data, activeSlug]);

  const handleLoad = () => {
    const fallback = defaultPages.find((item) => item.slug === activeSlug);
    setTitle(page?.title ?? fallback?.title ?? "");
    setStatus(page?.status ?? "draft");
    setSeoTitle(page?.seoTitle ?? "");
    setSeoDescription(page?.seoDescription ?? "");
    setBody(page?.body ?? "");
  };

  const handleSave = async () => {
    const payload: Partial<StaticPage> = {
      slug: activeSlug,
      title,
      body,
      status,
      seoTitle,
      seoDescription,
      publishedAt: status === "published" ? new Date().toISOString() : null
    };
    await upsert.mutateAsync({ slug: activeSlug, payload });
    push({ title: "Saved", description: "Static page updated." });
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Static Pages</h1>
        <p className="text-sm text-muted-foreground">Manage legal, help, and about pages with SEO metadata.</p>
      </div>

      <Card>
        <div className="flex flex-wrap gap-2">
          {defaultPages.map((item) => (
            <button
              key={item.slug}
              className={`rounded-xl border px-3 py-2 text-xs ${item.slug === activeSlug ? "border-primary text-foreground" : "border-border text-muted-foreground"}`}
              onClick={() => {
                setActiveSlug(item.slug);
                setTimeout(handleLoad, 0);
              }}
            >
              {item.title}
            </button>
          ))}
        </div>
+        <div className="mt-4 flex gap-2">
+          <Button className="bg-muted text-foreground" type="button" onClick={handleLoad}>
+            Load
+          </Button>
+        </div>
      </Card>

      <Card>
        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <label className="text-xs font-semibold text-muted-foreground">Title</label>
            <Input value={title} onChange={(event) => setTitle(event.target.value)} />
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground">Status</label>
            <select
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
              value={status}
              onChange={(event) => setStatus(event.target.value as StaticPageStatus)}
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground">SEO Title</label>
            <Input value={seoTitle} onChange={(event) => setSeoTitle(event.target.value)} />
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground">SEO Description</label>
            <Textarea value={seoDescription} onChange={(event) => setSeoDescription(event.target.value)} />
          </div>
        </div>
      </Card>

      <Card>
        <label className="text-xs font-semibold text-muted-foreground">Body</label>
        <MarkdownEditor value={body} onChange={setBody} />
      </Card>

      <Button type="button" onClick={handleSave}>
        Save Page
      </Button>
    </div>
  );
}
