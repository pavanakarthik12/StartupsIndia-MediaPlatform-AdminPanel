import { useUiStore } from "@/store/uiStore";
import { Modal } from "@/components/common/Modal";

export function GlobalSearch() {
  const { searchOpen, setSearchOpen } = useUiStore();

  return (
    <Modal open={searchOpen} onClose={() => setSearchOpen(false)} title="Global Search">
      <input
        className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
        placeholder="Search articles, users, topics..."
      />
      <p className="mt-4 text-xs text-muted-foreground">Search results will appear here.</p>
    </Modal>
  );
}
