import { create } from "zustand";

const useSecureStore = create((set) => ({
  userId: null,
  accessToken: null,
  refreshToken: null,
  // Load the user id, access token, and refresh token from secure store
  setUserId: (id) => {
    set((state) => {
      state.userId = id;
    });
  },
  setAccessToken: (accessToken) => {
    set((state) => {
      state.accessToken = accessToken;
    });
  },
  setRefreshToken: (refreshToken) => {
    set((state) => {
      state.refreshToken = refreshToken;
    });
  },
  clearAuthInfo: () => {
    set((state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
    });
  },
}));

export default useSecureStore;
