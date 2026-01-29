import { create } from "zustand";
import { persist } from "zustand/middleware";

type ViewMode = "map" | "calendar" | null;

interface ViewModeState {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
}

export const useViewModeStore = create<ViewModeState>()(
  persist(
    (set) => ({
      viewMode: null,
      setViewMode: (mode) => set({ viewMode: mode }),
      _hasHydrated: false,
      setHasHydrated: (state) => set({ _hasHydrated: state }),
    }),
    {
      name: "view-mode",
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
