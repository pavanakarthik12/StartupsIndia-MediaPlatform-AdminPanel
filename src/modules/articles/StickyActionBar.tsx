import { Button } from "@/components/ui/button";

export function StickyActionBar({
  onSaveDraft,
  onSubmit,
  loading
}: {
  onSaveDraft: () => void;
  onSubmit: () => void;
  loading: boolean;
}) {
  return (
    <div className="sticky bottom-6 z-20 rounded-xl border border-border bg-card/90 p-4 backdrop-blur">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="text-xs text-muted-foreground">Draft autosaves every 10 seconds.</div>
        <div className="flex gap-2">
          <Button className="bg-muted text-foreground" onClick={onSaveDraft} type="button">
            Save Draft
          </Button>
          <Button onClick={onSubmit} type="button" disabled={loading}>
            {loading ? "Saving..." : "Submit for Review"}
          </Button>
        </div>
      </div>
    </div>
  );
}
