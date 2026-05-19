import { useTheme } from "@/hooks/useTheme";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      className="rounded-xl border border-border bg-card px-3 py-2 text-xs font-medium"
      onClick={toggleTheme}
    >
      {theme === "dark" ? "Light" : "Dark"}
    </button>
  );
}
