import { Card } from "@/components/ui/card";

export function ArticlePreview({ headline, body, image }: { headline: string; body: string; image?: string }) {
  return (
    <Card className="space-y-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Mobile Preview</p>
      <div className="mx-auto w-full max-w-xs overflow-hidden rounded-[2rem] border border-border bg-black">
        <div className="bg-card p-4">
          {image && <img src={image} alt="Cover" className="mb-3 h-40 w-full rounded-xl object-cover" />}
          <h3 className="text-base font-semibold text-foreground">{headline || "Headline"}</h3>
          <p className="mt-2 max-h-20 overflow-hidden text-xs text-muted-foreground">{body || "Preview the article content."}</p>
        </div>
      </div>
    </Card>
  );
}
