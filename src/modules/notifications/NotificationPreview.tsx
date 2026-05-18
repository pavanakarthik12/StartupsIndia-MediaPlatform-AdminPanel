import { Card } from "@/components/ui/card";

export function NotificationPreview({ title, body }: { title: string; body: string }) {
  return (
    <Card>
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Preview</p>
      <div className="mt-3 rounded-xl border border-border bg-muted/40 p-3">
        <p className="text-sm font-semibold">{title || "Notification title"}</p>
        <p className="mt-1 text-xs text-muted-foreground">{body || "Notification body preview."}</p>
      </div>
    </Card>
  );
}
