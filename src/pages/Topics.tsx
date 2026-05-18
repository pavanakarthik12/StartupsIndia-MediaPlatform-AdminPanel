import { Card } from "@/components/ui/card";

export function Topics() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Topics</h1>
        <p className="text-sm text-muted-foreground">Manage categories and interests used across the app.</p>
      </div>
      <Card>
        <p className="text-sm text-muted-foreground">Topic management table goes here.</p>
      </Card>
    </div>
  );
}
