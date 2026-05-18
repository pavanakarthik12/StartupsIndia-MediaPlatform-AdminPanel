import { Card } from "@/components/ui/card";

export function HomeModules() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Home Modules</h1>
        <p className="text-sm text-muted-foreground">Manage hero stories, events, funding, courses, and communities.</p>
      </div>
      <Card>
        <p className="text-sm text-muted-foreground">Home module CMS panels go here.</p>
      </Card>
    </div>
  );
}
