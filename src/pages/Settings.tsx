import { Card } from "@/components/ui/card";

export function Settings() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Settings</h1>
        <p className="text-sm text-muted-foreground">Configure admin access, static pages, and app preferences.</p>
      </div>
      <Card>
        <p className="text-sm text-muted-foreground">Settings forms go here.</p>
      </Card>
    </div>
  );
}
