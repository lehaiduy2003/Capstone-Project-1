import { create } from "zustand";

const useReachedEndStore = create((set) => ({
  reachedEnd: false,

  setReachedEnd: (reached) => set(() => ({ reachedEnd: reached })),
  resetReachedEnd: () => set(() => ({ reachedEnd: false })),
}));

export default useReachedEndStore;
