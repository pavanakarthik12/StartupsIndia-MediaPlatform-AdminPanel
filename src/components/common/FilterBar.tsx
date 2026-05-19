import { Input } from "@/components/ui/input";

export function FilterBar({ placeholder }: { placeholder: string }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <Input className="max-w-xs" placeholder={placeholder} />
      <div className="flex gap-2">
        <button className="rounded-xl border border-border bg-card px-3 py-2 text-xs">Filter</button>
        <button className="rounded-xl border border-border bg-card px-3 py-2 text-xs">Export</button>
      </div>
    </div>
  );
}
