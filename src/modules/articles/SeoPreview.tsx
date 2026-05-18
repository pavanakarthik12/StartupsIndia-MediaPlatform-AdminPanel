import { Card } from "@/components/ui/card";

export function SeoPreview({ title, description }: { title: string; description: string }) {
  return (
    <Card>
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">SEO Preview</p>
      <div className="mt-3">
        <p className="text-base font-semibold text-foreground">{title || "Untitled article"}</p>
        <p className="mt-1 text-sm text-muted-foreground">{description || "Add a description to improve search visibility."}</p>
        <p className="mt-2 text-xs text-muted-foreground">startupsindia.com/article/your-slug</p>
      </div>
    </Card>
  );
}
