import { Outlet } from "react-router-dom";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { CommandPalette } from "@/components/common/CommandPalette";
import { GlobalSearch } from "@/components/common/GlobalSearch";

export function AdminLayout() {
  return (
    <div className="app-shell min-h-screen bg-background">
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex min-h-screen flex-1 flex-col">
          <Topbar />
          <main className="flex-1 px-6 pb-10 pt-6">
            <Outlet />
          </main>
        </div>
      </div>
      <CommandPalette />
      <GlobalSearch />
    </div>
  );
}
