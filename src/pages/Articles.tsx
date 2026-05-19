import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Table } from "@/components/ui/table";
import { Pagination } from "@/components/common/Pagination";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/common/Modal";
import { ArticleStatusBadge } from "@/modules/articles/ArticleStatusBadge";
import { useArticlesQuery, useArticleMutations } from "@/hooks/useArticles";
import type { Article, ArticleStatus } from "@/types/articles";
import { useToast } from "@/hooks/useToast";
import { useAuth } from "@/hooks/useAuth";
import { canPublish } from "@/utils/guards";

type FilterState = {
  status: "all" | ArticleStatus;
  category: string;
  source: string;
  author: string;
  dateFrom: string;
  dateTo: string;
  search: string;
};

const filterStorageKey = "si-article-filters";

export function Articles() {
  const { data = [], isLoading } = useArticlesQuery();
  const { bulkStatus, remove, updateStatus } = useArticleMutations();
  const { push } = useToast();
  const { role } = useAuth();
  const navigate = useNavigate();
  const [filters, setFilters] = useState<FilterState>({
    status: "all",
    category: "",
    source: "",
    author: "",
    dateFrom: "",
    dateTo: "",
    search: ""
  });
  const [searchInput, setSearchInput] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [rejectTarget, setRejectTarget] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"updated" | "created" | "likes">("updated");
  const [savedFilters, setSavedFilters] = useState<Record<string, FilterState>>({});
  const pageSize = 10;

  useEffect(() => {
    const stored = localStorage.getItem(filterStorageKey);
    if (stored) {
      try {
        setSavedFilters(JSON.parse(stored) as Record<string, FilterState>);
      } catch {
        setSavedFilters({});
      }
    }
  }, []);

  useEffect(() => {
    const handler = window.setTimeout(() => {
      setFilters((prev) => ({ ...prev, search: searchInput }));
      setPage(1);
    }, 300);
    return () => window.clearTimeout(handler);
  }, [searchInput]);

  const filteredArticles = useMemo(() => {
    const filtered = data.filter((article) => {
      const matchesStatus = filters.status === "all" || article.status === filters.status;
      const matchesCategory = !filters.category || article.category?.toLowerCase().includes(filters.category.toLowerCase());
      const matchesSource = !filters.source || article.sourceName?.toLowerCase().includes(filters.source.toLowerCase());
      const matchesAuthor = !filters.author || article.authorId?.toLowerCase().includes(filters.author.toLowerCase());
      const matchesSearch =
        !filters.search ||
        article.headline?.toLowerCase().includes(filters.search.toLowerCase()) ||
        article.sourceName?.toLowerCase().includes(filters.search.toLowerCase());

      const createdAt = article.createdAt ? new Date(String(article.createdAt)) : null;
      const from = filters.dateFrom ? new Date(filters.dateFrom) : null;
      const to = filters.dateTo ? new Date(filters.dateTo) : null;
      const matchesFrom = !from || (createdAt ? createdAt >= from : true);
      const matchesTo = !to || (createdAt ? createdAt <= to : true);

      return matchesStatus && matchesCategory && matchesSource && matchesAuthor && matchesSearch && matchesFrom && matchesTo;
    });

    return filtered.sort((a, b) => {
      if (sortBy === "likes") return (b.likesCount ?? 0) - (a.likesCount ?? 0);
      if (sortBy === "created") return String(b.createdAt ?? "").localeCompare(String(a.createdAt ?? ""));
      return String(b.updatedAt ?? "").localeCompare(String(a.updatedAt ?? ""));
    });
  }, [data, filters, sortBy]);

  const pageCount = Math.max(1, Math.ceil(filteredArticles.length / pageSize));
  const pageItems = filteredArticles.slice((page - 1) * pageSize, page * pageSize);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const toggleSelectAll = () => {
    const pageIds = pageItems.map((item) => item.id);
    const allSelected = pageIds.every((id) => selectedIds.includes(id));
    if (allSelected) {
      setSelectedIds(selectedIds.filter((id) => !pageIds.includes(id)));
      return;
    }
    const next = new Set([...selectedIds, ...pageIds]);
    setSelectedIds(Array.from(next));
  };

  const handleBulk = async (status: ArticleStatus) => {
    if (selectedIds.length === 0) return;
    await bulkStatus.mutateAsync({
      ids: selectedIds,
      status,
      meta: {
        reviewedAt: new Date().toISOString()
      }
    });
    push({ title: "Bulk update", description: `Updated ${selectedIds.length} articles.` });
    setSelectedIds([]);
  };

  const handleBulkReject = async (targetIds: string[]) => {
    if (targetIds.length === 0) return;
    await bulkStatus.mutateAsync({
      ids: targetIds,
      status: "rejected",
      meta: {
        rejectionReason: rejectReason,
        reviewedAt: new Date().toISOString()
      }
    });
    setRejectReason("");
    setRejectOpen(false);
    setSelectedIds([]);
    push({ title: "Rejected", description: "Selected articles rejected." });
  };

  const handleRejectSubmit = async () => {
    const targetIds = rejectTarget ? [rejectTarget] : selectedIds;
    await handleBulkReject(targetIds);
    setRejectTarget(null);
  };

  const handleApproveOne = async (id: string) => {
    await updateStatus.mutateAsync({
      id,
      status: "published",
      meta: { reviewedAt: new Date().toISOString() }
    });
  };

  const handleDelete = async (id: string) => {
    await remove.mutateAsync(id);
    push({ title: "Deleted", description: "Article removed." });
  };

  const exportCsv = () => {
    const rows = filteredArticles.map((item) => ({
      headline: item.headline,
      category: item.category,
      status: item.status,
      sourceName: item.sourceName,
      authorId: item.authorId
    }));
    const header = Object.keys(rows[0] ?? {}).join(",");
    const body = rows.map((row) => Object.values(row).map((value) => `"${String(value ?? "")}"`).join(",")).join("\n");
    const csv = `${header}\n${body}`;
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "articles.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const saveFilter = () => {
    const name = window.prompt("Filter name?");
    if (!name) return;
    const updated = { ...savedFilters, [name]: filters };
    setSavedFilters(updated);
    localStorage.setItem(filterStorageKey, JSON.stringify(updated));
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Articles</h1>
          <p className="text-sm text-muted-foreground">Create, review, and publish startup stories.</p>
        </div>
        <Button onClick={() => navigate("/articles/new")} type="button">
          New Article
        </Button>
      </div>

      <Card>
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {(["all", "pending", "published", "rejected", "archived", "draft"] as const).map((status) => (
            <button
              key={status}
              className={`rounded-xl border px-3 py-2 ${filters.status === status ? "border-primary text-foreground" : "border-border text-muted-foreground"}`}
              onClick={() => setFilters((prev) => ({ ...prev, status }))}
              type="button"
            >
              {status}
            </button>
          ))}
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-3 xl:grid-cols-6">
          <Input placeholder="Search" value={searchInput} onChange={(event) => setSearchInput(event.target.value)} />
          <Input
            placeholder="Category"
            value={filters.category}
            onChange={(event) => setFilters((prev) => ({ ...prev, category: event.target.value }))}
          />
          <Input
            placeholder="Source"
            value={filters.source}
            onChange={(event) => setFilters((prev) => ({ ...prev, source: event.target.value }))}
          />
          <Input
            placeholder="Author"
            value={filters.author}
            onChange={(event) => setFilters((prev) => ({ ...prev, author: event.target.value }))}
          />
          <Input
            type="date"
            value={filters.dateFrom}
            onChange={(event) => setFilters((prev) => ({ ...prev, dateFrom: event.target.value }))}
          />
          <Input
            type="date"
            value={filters.dateTo}
            onChange={(event) => setFilters((prev) => ({ ...prev, dateTo: event.target.value }))}
          />
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
          <select
            className="rounded-xl border border-border bg-card px-3 py-2"
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value as "updated" | "created" | "likes")}
          >
            <option value="updated">Sort by updated</option>
            <option value="created">Sort by created</option>
            <option value="likes">Sort by likes</option>
          </select>
          <Button className="bg-muted text-foreground" type="button" onClick={saveFilter}>
            Save Filter
          </Button>
          <select
            className="rounded-xl border border-border bg-card px-3 py-2"
            onChange={(event) => {
              const next = savedFilters[event.target.value];
              if (next) setFilters(next);
            }}
          >
            <option value="">Saved Filters</option>
            {Object.keys(savedFilters).map((key) => (
              <option key={key} value={key}>
                {key}
              </option>
            ))}
          </select>
          <Button className="bg-muted text-foreground" type="button" onClick={exportCsv}>
            Export CSV
          </Button>
        </div>
      </Card>

      <Card>
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <Button className="bg-muted text-foreground" type="button" onClick={() => handleBulk("published")}>
            Bulk Publish
          </Button>
          <Button className="bg-muted text-foreground" type="button" onClick={() => setRejectOpen(true)}>
            Bulk Reject
          </Button>
          <Button className="bg-muted text-foreground" type="button" onClick={() => handleBulk("archived")}>
            Bulk Archive
          </Button>
          <Button
            className="bg-muted text-foreground"
            type="button"
            onClick={() => {
              if (selectedIds.length === 0) return;
              const confirmed = window.confirm("Delete selected articles?");
              if (!confirmed) return;
              Promise.all(selectedIds.map((id) => remove.mutateAsync(id))).then(() => {
                setSelectedIds([]);
                push({ title: "Deleted", description: "Selected articles removed." });
              });
            }}
          >
            Bulk Delete
          </Button>
        </div>
      </Card>

      <Card>
        <Table>
          <thead className="bg-muted text-left text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-3">
                <input type="checkbox" onChange={toggleSelectAll} />
              </th>
              <th className="px-4 py-3">Headline</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Trending</th>
              <th className="px-4 py-3">Likes</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {isLoading ? (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-sm text-muted-foreground">
                  Loading articles...
                </td>
              </tr>
            ) : (
              pageItems.map((article) => (
                <tr key={article.id} className="border-t border-border">
                  <td className="px-4 py-3">
                    <input type="checkbox" checked={selectedIds.includes(article.id)} onChange={() => toggleSelect(article.id)} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-foreground">{article.headline}</div>
                    <div className="text-xs text-muted-foreground">{article.sourceName}</div>
                  </td>
                  <td className="px-4 py-3">{article.category}</td>
                  <td className="px-4 py-3">
                    <ArticleStatusBadge status={(article.status ?? "draft") as ArticleStatus} />
                  </td>
                  <td className="px-4 py-3">{article.isTrending ? "Yes" : "No"}</td>
                  <td className="px-4 py-3">{article.likesCount ?? 0}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2 text-xs">
                      <button className="text-primary" onClick={() => navigate(`/articles/${article.id}`)}>
                        Edit
                      </button>
                      {canPublish(role) && (
                        <button className="text-muted-foreground" onClick={() => handleApproveOne(article.id)}>
                          Approve
                        </button>
                      )}
                      {canPublish(role) && (
                        <button
                          className="text-muted-foreground"
                          onClick={() => {
                            setRejectTarget(article.id);
                            setRejectOpen(true);
                          }}
                        >
                          Reject
                        </button>
                      )}
                      <button className="text-muted-foreground" onClick={() => handleDelete(article.id)}>
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

      <Modal open={rejectOpen} onClose={() => setRejectOpen(false)} title="Reject Articles">
        <textarea
          className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
          placeholder="Rejection reason"
          value={rejectReason}
          onChange={(event) => setRejectReason(event.target.value)}
        />
        <div className="mt-4 flex gap-2">
          <Button onClick={handleRejectSubmit} type="button">
            Reject selected
          </Button>
          <Button className="bg-muted text-foreground" onClick={() => setRejectOpen(false)} type="button">
            Cancel
          </Button>
        </div>
      </Modal>
    </div>
  );
}
