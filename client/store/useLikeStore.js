// store.js
import { create } from "zustand";

// Define the store
const useLikeStore = create((set) => ({
  count: 0,
  user_id: null,
  likeItems: [],

  // Action to add a like item
  addLikeItem: (item) =>
    set((state) => ({
      likeItems: [...state.likeItems, item],
      count: state.count + 1,
    })),

  // Action to remove a like item
  removeLikeItem: (itemId) =>
    set((state) => ({
      likeItems: state.likeItems.filter((item) => item.id !== itemId),
      count: state.count - 1,
    })),
}));

export default useLikeStore;
