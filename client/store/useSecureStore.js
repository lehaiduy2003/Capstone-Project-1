import { create } from "zustand";
import { getValueFor } from "../utils/secureStore";

const useSecureStore = create((set) => ({
  userId: null,
  accessToken: null,
  refreshToken: null,
  // Load the user id, access token, and refresh token from secure store
  initAuthInfo: async () => {
    try {
      const userId = await getValueFor("userId");
      const accessToken = await getValueFor("accessToken");
      const refreshToken = await getValueFor("refreshToken");

      if (userId && accessToken && refreshToken) {
        set({
          userId: userId,
          accessToken: accessToken,
          refreshToken: refreshToken,
        });
      }
    } catch (error) {
      console.error("Failed to load auth info from secure store", error);
    }
  },

  setUserId: (id) => {
    set({
      userId: id,
    });
  },
  setAccessToken: (accessToken) => {
    set({
      accessToken: accessToken,
    });
  },
  setRefreshToken: (refreshToken) => {
    set({
      refreshToken: refreshToken,
    });
  },
  clearAuthInfo: () => {
    set({
      userId: null,
      accessToken: null,
      refreshToken: null,
    });
  },
}));

export default useSecureStore;
