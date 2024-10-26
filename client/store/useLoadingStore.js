import { create } from "zustand";

const useLoadingStore = create((set) => ({
  isLoading: false,

  setLoading: (loading) => set(() => ({ isLoading: loading })),
  resetLoading: () => set(() => ({ isLoading: false })),
}));

export default useLoadingStore;
