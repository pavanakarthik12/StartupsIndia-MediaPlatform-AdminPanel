import { Card } from "@/components/ui/card";

export function MiniList({ title, items }: { title: string; items: Array<{ label: string; value: string }> }) {
  return (
    <Card>
      <h3 className="text-sm font-semibold">{title}</h3>
      <div className="mt-4 space-y-3 text-sm text-muted-foreground">
        {items.map((item) => (
          <div key={`${title}-${item.label}`} className="flex items-center justify-between">
            <span>{item.label}</span>
            <span className="text-foreground">{item.value}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
