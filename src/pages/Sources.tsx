import { Card } from "@/components/ui/card";

export function Sources() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Sources</h1>
        <p className="text-sm text-muted-foreground">Manage publisher profiles and verified sources.</p>
      </div>
      <Card>
        <p className="text-sm text-muted-foreground">Source management table goes here.</p>
      </Card>
    </div>
  );
}
