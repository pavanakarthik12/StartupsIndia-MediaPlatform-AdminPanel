import { Card } from "@/components/ui/card";
import { TrendChip } from "@/modules/dashboard/TrendChip";

export function AnalyticsCard({
  label,
  value,
  trend
}: {
  label: string;
  value: string | number;
  trend?: string;
}) {
  return (
    <Card className="flex flex-col gap-2">
      <span className="text-xs uppercase tracking-wide text-muted-foreground">{label}</span>
      <div className="text-2xl font-semibold">{value}</div>
      {trend && <TrendChip value={trend} />}
    </Card>
  );
}
