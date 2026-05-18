import { Card } from "@/components/ui/card";

export function Moderation() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Moderation</h1>
        <p className="text-sm text-muted-foreground">Review reported content and comments.</p>
      </div>
      <Card>
        <p className="text-sm text-muted-foreground">Moderation queue goes here.</p>
      </Card>
    </div>
  );
}
