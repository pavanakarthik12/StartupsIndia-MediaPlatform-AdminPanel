import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Table } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/common/Pagination";
import { SourceStatusBadge } from "@/modules/sources/SourceStatusBadge";
import { useSourcesQuery, useSourceMutations } from "@/hooks/useSources";

type Filters = {
  search: string;
  verified: "all" | "verified" | "unverified";
  active: "all" | "active" | "inactive";
};

export function Sources() {
  const { data = [], isLoading } = useSourcesQuery();
  const { update, remove } = useSourceMutations();
  const navigate = useNavigate();
  const [filters, setFilters] = useState<Filters>({ search: "", verified: "all", active: "all" });
  const [searchInput, setSearchInput] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 12;

  useEffect(() => {
    const handler = window.setTimeout(() => {
      setFilters((prev) => ({ ...prev, search: searchInput }));
      setPage(1);
    }, 300);
    return () => window.clearTimeout(handler);
  }, [searchInput]);

  const filtered = useMemo(() => {
    return data.filter((source) => {
      const matchesSearch =
        !filters.search ||
        source.name?.toLowerCase().includes(filters.search.toLowerCase()) ||
        source.slug?.toLowerCase().includes(filters.search.toLowerCase());
      const matchesVerified =
        filters.verified === "all" || (filters.verified === "verified" ? source.isVerified : !source.isVerified);
      const matchesActive =
        filters.active === "all" || (filters.active === "active" ? source.isActive : !source.isActive);
      return matchesSearch && matchesVerified && matchesActive;
    });
  }, [data, filters]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageItems = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Sources</h1>
          <p className="text-sm text-muted-foreground">Manage publisher profiles and verification.</p>
        </div>
        <Button onClick={() => navigate("/sources/new")} type="button">
          New Source
        </Button>
      </div>

      <Card>
        <div className="grid gap-3 md:grid-cols-3">
          <Input placeholder="Search by name or slug" value={searchInput} onChange={(event) => setSearchInput(event.target.value)} />
          <select
            className="rounded-xl border border-border bg-card px-3 py-2 text-sm"
            value={filters.verified}
            onChange={(event) => setFilters((prev) => ({ ...prev, verified: event.target.value as Filters["verified"] }))}
          >
            <option value="all">All verification</option>
            <option value="verified">Verified</option>
            <option value="unverified">Unverified</option>
          </select>
          <select
            className="rounded-xl border border-border bg-card px-3 py-2 text-sm"
            value={filters.active}
            onChange={(event) => setFilters((prev) => ({ ...prev, active: event.target.value as Filters["active"] }))}
          >
            <option value="all">All status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </Card>

      <Card>
        <Table>
          <thead className="bg-muted text-left text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Source</th>
              <th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3">Followers</th>
              <th className="px-4 py-3">Articles</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-sm text-muted-foreground">
                  Loading sources...
                </td>
              </tr>
            ) : (
              pageItems.map((source) => (
                <tr key={source.id} className="border-t border-border">
                  <td className="px-4 py-3">
                    <div className="font-medium text-foreground">{source.name}</div>
                    <div className="text-xs text-muted-foreground">{source.websiteUrl}</div>
                  </td>
                  <td className="px-4 py-3">{source.slug}</td>
                  <td className="px-4 py-3">{source.followersCount ?? 0}</td>
                  <td className="px-4 py-3">{source.newsCount ?? 0}</td>
                  <td className="px-4 py-3">
                    <SourceStatusBadge isVerified={source.isVerified} isActive={source.isActive} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2 text-xs">
                      <button className="text-primary" onClick={() => navigate(`/sources/${source.id}`)}>
                        View
                      </button>
                      <button
                        className="text-muted-foreground"
                        onClick={() => update.mutateAsync({ id: source.id, payload: { isVerified: !source.isVerified } })}
                      >
                        Toggle Verify
                      </button>
                      <button
                        className="text-muted-foreground"
                        onClick={() => update.mutateAsync({ id: source.id, payload: { isActive: !source.isActive } })}
                      >
                        Toggle Active
                      </button>
                      <button className="text-muted-foreground" onClick={() => remove.mutateAsync(source.id)}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </Card>

      <Pagination page={page} total={pageCount} onPageChange={setPage} />
    </div>
  );
}
