import { useMemo } from "react";
import { renderMarkdownPreview } from "@/utils/markdown";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const toolbarButtons = [
  { label: "Bold", wrap: "**" },
  { label: "Italic", wrap: "*" },
  { label: "H2", wrap: "## " },
  { label: "Quote", wrap: "> " },
  { label: "Code", wrap: "`" },
  { label: "List", wrap: "- " }
];

export function MarkdownEditor({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const preview = useMemo(() => renderMarkdownPreview(value), [value]);

  const applyWrap = (token: string) => {
    onChange(`${token}${value}${token}`);
  };

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap gap-2">
          {toolbarButtons.map((button) => (
            <button
              key={button.label}
              className="rounded-xl border border-border bg-card px-3 py-1 text-xs"
              onClick={() => applyWrap(button.wrap)}
              type="button"
            >
              {button.label}
            </button>
          ))}
        </div>
        <Textarea
          className="min-h-[320px] resize-none"
          placeholder="Write your article body in Markdown..."
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
      </div>
      <div className="rounded-xl border border-border bg-card p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Live Preview</p>
        <div
          className={cn("mt-3 space-y-2 text-sm leading-relaxed text-foreground", "prose prose-invert:max-w-none")}
          dangerouslySetInnerHTML={{ __html: preview }}
        />
      </div>
    </div>
  );
}
