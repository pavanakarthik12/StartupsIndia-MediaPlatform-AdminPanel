import { Card } from "@/components/ui/card";

export function Notifications() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Notifications</h1>
        <p className="text-sm text-muted-foreground">Create and track notification campaigns.</p>
      </div>
      <Card>
        <p className="text-sm text-muted-foreground">Campaign builder and history table goes here.</p>
      </Card>
    </div>
  );
}
