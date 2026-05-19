import { useUiStore } from "@/store/uiStore";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import { cn } from "@/lib/utils";

export function Topbar() {
  const { toggleSidebar, setCommandOpen, setSearchOpen } = useUiStore();

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between border-b border-border bg-background/80 px-6 py-4 backdrop-blur">
      <div className="flex items-center gap-4">
        <button
          className="rounded-xl border border-border bg-card px-3 py-2 text-xs font-medium"
          onClick={toggleSidebar}
        >
          Toggle
        </button>
        <button
          className={cn(
            "hidden rounded-xl border border-border bg-card px-3 py-2 text-xs font-medium lg:inline-flex"
          )}
          onClick={() => setCommandOpen(true)}
        >
          Command
        </button>
      </div>
      <div className="flex items-center gap-3">
        <button
          className="rounded-xl border border-border bg-card px-3 py-2 text-xs font-medium"
          onClick={() => setSearchOpen(true)}
        >
          Search
        </button>
        <ThemeToggle />
        <div className="hidden items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 text-xs font-medium lg:flex">
          Admin
        </div>
      </div>
    </header>
  );
}
