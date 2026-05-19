import { create } from "zustand";

type UiState = {
  sidebarCollapsed: boolean;
  commandOpen: boolean;
  searchOpen: boolean;
  toggleSidebar: () => void;
  setCommandOpen: (open: boolean) => void;
  setSearchOpen: (open: boolean) => void;
};

export const useUiStore = create<UiState>((set) => ({
  sidebarCollapsed: false,
  commandOpen: false,
  searchOpen: false,
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  setCommandOpen: (open) => set({ commandOpen: open }),
  setSearchOpen: (open) => set({ searchOpen: open })
}));
