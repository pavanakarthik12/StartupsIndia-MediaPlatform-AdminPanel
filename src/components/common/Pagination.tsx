export function Pagination({ page, total, onPageChange }: { page: number; total: number; onPageChange: (page: number) => void }) {
  return (
    <div className="flex items-center gap-2 text-xs text-muted-foreground">
      <button
        className="rounded-xl border border-border bg-card px-3 py-1"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
      >
        Prev
      </button>
      <span>
        Page {page} of {total}
      </span>
      <button
        className="rounded-xl border border-border bg-card px-3 py-1"
        disabled={page >= total}
        onClick={() => onPageChange(page + 1)}
      >
        Next
      </button>
    </div>
  );
}
