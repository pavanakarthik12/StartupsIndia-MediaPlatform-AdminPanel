import { useUiStore } from "@/store/uiStore";
import { Modal } from "@/components/common/Modal";

const commands = [
  "Create article",
  "Send notification",
  "View users",
  "Open settings",
  "Go to moderation"
];

export function CommandPalette() {
  const { commandOpen, setCommandOpen } = useUiStore();

  return (
    <Modal open={commandOpen} onClose={() => setCommandOpen(false)} title="Command Palette">
      <input
        className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
        placeholder="Type a command..."
      />
      <div className="mt-4 grid gap-2">
        {commands.map((command) => (
          <button
            key={command}
            className="w-full rounded-xl border border-border bg-muted px-3 py-2 text-left text-sm"
          >
            {command}
          </button>
        ))}
      </div>
    </Modal>
  );
}
