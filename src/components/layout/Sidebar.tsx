import { NavLink } from "react-router-dom";
import { useUiStore } from "@/store/uiStore";
import { routes } from "@/constants/routes";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Dashboard", href: routes.dashboard },
  { label: "Articles", href: routes.articles },
  { label: "Users", href: routes.users },
  { label: "Topics", href: routes.topics },
  { label: "Sources", href: routes.sources },
  { label: "Notifications", href: routes.notifications },
  { label: "Moderation", href: routes.moderation },
  { label: "Home Modules", href: routes.homeModules },
  { label: "Settings", href: routes.settings }
];

export function Sidebar() {
  const { sidebarCollapsed } = useUiStore();

  return (
    <aside
      className={cn(
        "sidebar-shadow hidden min-h-screen w-64 flex-col border-r border-border bg-card/80 px-4 pb-6 pt-6 backdrop-blur xl:flex",
        sidebarCollapsed && "w-20"
      )}
    >
      <div className="mb-8 flex items-center justify-between">
        <div className={cn("text-lg font-semibold", sidebarCollapsed && "text-center text-xs")}>SI Admin</div>
      </div>
      <nav className="flex flex-1 flex-col gap-1">
        {navItems.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            className={({ isActive }) =>
              cn(
                "rounded-xl px-3 py-2 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground",
                isActive && "bg-muted text-foreground"
              )
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="mt-6 rounded-xl border border-border bg-muted p-3 text-xs text-muted-foreground">
        <p>Firebase: startupsindia-mediaplatform</p>
        <p className="mt-1">Admin CMS v0.1</p>
      </div>
    </aside>
  );
}
