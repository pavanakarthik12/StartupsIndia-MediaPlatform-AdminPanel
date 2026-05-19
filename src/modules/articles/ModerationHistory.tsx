import { Card } from "@/components/ui/card";
import type { Article } from "@/types/articles";

export function ModerationHistory({ history }: { history: Article["moderationHistory"] }) {
  return (
    <Card>
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Moderation History</p>
      <div className="mt-4 space-y-3 text-sm text-muted-foreground">
        {history && history.length > 0 ? (
          history.map((item, index) => (
            <div key={`${item.action}-${index}`} className="rounded-xl border border-border bg-muted/40 p-3">
              <div className="flex items-center justify-between">
                <span className="font-medium text-foreground">{item.action}</span>
                <span className="text-xs">{String(item.at ?? "")}</span>
              </div>
              <p className="mt-1 text-xs">By {item.by}</p>
              {item.reason && <p className="mt-2 text-xs">Reason: {item.reason}</p>}
            </div>
          ))
        ) : (
          <p className="text-xs">No moderation actions yet.</p>
        )}
      </div>
    </Card>
  );
}
