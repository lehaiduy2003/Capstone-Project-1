import { create } from "zustand";
import { deleteValueFor, getValueFor } from "../utils/secureStore";

const useSecureStore = create((set) => ({
  userId: null,
  accessToken: null,
  refreshToken: null,
  isLoggedIn: false,
  // Load the user id, access token, and refresh token from secure store
  initAuthInfo: async () => {
    try {
      const userId = await getValueFor("user_id");
      const accessToken = await getValueFor("accessToken");
      const refreshToken = await getValueFor("refreshToken");

      if (userId && accessToken && refreshToken) {
        set({
          userId: userId,
          accessToken: accessToken,
          refreshToken: refreshToken,
          isLoggedIn: true,
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
  setIsLoggedIn: (isLoggedIn) => {
    set({
      isLoggedIn: isLoggedIn,
    });
  },
  clearAuthInfo: async () => {
    await deleteValueFor("user_id");
    await deleteValueFor("userId");
    await deleteValueFor("accessToken");
    await deleteValueFor("refreshToken");
    set({
      userId: null,
      accessToken: null,
      refreshToken: null,
      isLoggedIn: false,
    });
  },
}));

export default useSecureStore;
