import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function Settings() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Settings</h1>
        <p className="text-sm text-muted-foreground">Configure admin access, static pages, and app preferences.</p>
      </div>
      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold">Static Pages</p>
            <p className="text-xs text-muted-foreground">Manage privacy policy, terms, help, and about pages.</p>
          </div>
          <Button className="bg-muted text-foreground" type="button" onClick={() => navigate("/settings/static-pages")}>
            Open
          </Button>
        </div>
      </Card>
    </div>
  );
}
