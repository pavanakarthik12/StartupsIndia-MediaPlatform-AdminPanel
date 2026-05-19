import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useSourceQuery, useSourceMutations } from "@/hooks/useSources";
import { useArticlesQuery } from "@/hooks/useArticles";

export function SourceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: source } = useSourceQuery(id);
  const { remove, update } = useSourceMutations();
  const { data: articles = [] } = useArticlesQuery();

  const sourceArticles = useMemo(() => articles.filter((item) => item.sourceId === id), [articles, id]);

  if (!source) {
    return (
      <div className="text-sm text-muted-foreground">
        Source not found.
        <button className="ml-2 text-primary" onClick={() => navigate("/sources")}>Back</button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">{source.name}</h1>
          <p className="text-sm text-muted-foreground">Source profile and analytics.</p>
        </div>
        <div className="flex gap-2">
          <Button className="bg-muted text-foreground" onClick={() => navigate(`/sources/${source.id}/edit`)} type="button">
            Edit
          </Button>
          <Button className="bg-muted text-foreground" onClick={() => remove.mutateAsync(source.id)} type="button">
            Delete
          </Button>
          <Button className="bg-muted text-foreground" onClick={() => navigate("/sources")} type="button">
            Back
          </Button>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <Card className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Status</p>
          <p className="text-sm">Verified: {source.isVerified ? "Yes" : "No"}</p>
          <p className="text-sm">Active: {source.isActive ? "Yes" : "No"}</p>
          <div className="flex gap-2">
            <Button className="bg-muted text-foreground" type="button" onClick={() => update.mutateAsync({ id: source.id, payload: { isVerified: !source.isVerified } })}>
              Toggle Verify
            </Button>
            <Button className="bg-muted text-foreground" type="button" onClick={() => update.mutateAsync({ id: source.id, payload: { isActive: !source.isActive } })}>
              Toggle Active
            </Button>
          </div>
        </Card>
        <Card>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Followers</p>
          <p className="mt-2 text-2xl font-semibold">{source.followersCount ?? 0}</p>
        </Card>
        <Card>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Articles</p>
          <p className="mt-2 text-2xl font-semibold">{sourceArticles.length}</p>
        </Card>
      </div>

      <Card>
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Articles</p>
        <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
          {sourceArticles.length > 0 ? sourceArticles.map((item) => <li key={item.id}>{item.headline}</li>) : <li>No articles linked.</li>}
        </ul>
      </Card>
    </div>
  );
}
