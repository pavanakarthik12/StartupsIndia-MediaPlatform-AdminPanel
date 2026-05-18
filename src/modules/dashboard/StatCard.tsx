import { Card } from "@/components/ui/card";
import { formatNumber } from "@/utils/format";

export function StatCard({ label, value, delta }: { label: string; value: number; delta?: string }) {
  return (
    <Card className="flex flex-col gap-2">
      <span className="text-xs uppercase tracking-wide text-muted-foreground">{label}</span>
      <div className="text-2xl font-semibold">{formatNumber(value)}</div>
      {delta && <span className="text-xs text-muted-foreground">{delta}</span>}
    </Card>
  );
}
