import { Card } from "@/components/ui/card";

export function ActivityFeed({ title, items }: { title: string; items: string[] }) {
  return (
    <Card>
      <h3 className="text-sm font-semibold">{title}</h3>
      <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
        {items.length > 0 ? items.map((item, index) => <li key={`${title}-${index}`}>{item}</li>) : <li>No activity yet.</li>}
      </ul>
    </Card>
  );
}
