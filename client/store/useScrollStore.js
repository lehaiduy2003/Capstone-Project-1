import { create } from "zustand";

export const useScrollStore = create((set, get) => ({
  scrollPositions: {},

  // save the scroll position of the screen to the store (name of the screen, position)
  setScrollPosition: (screen, position) =>
    set((state) => ({
      scrollPositions: {
        ...state.scrollPositions,
        [screen]: position,
      },
    })),

  // get the scroll position of the screen from the store
  getScrollPosition: (screen) => get().scrollPositions[screen] || 0,
}));
