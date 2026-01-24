import { create } from "zustand";

type ViewMode = "map" | "calendar";

interface ViewModeState {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
}

export const useViewModeStore = create<ViewModeState>((set) => ({
  viewMode: "map",
  setViewMode: (mode) => set({ viewMode: mode }),
}));
