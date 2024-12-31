import { create } from "zustand";
import { deleteValueFor, getValueFor } from "../utils/secureStore";

const useSecureStore = create((set) => ({
  userId: null,
  accessToken: null,
  role: null,
  refreshToken: null,
  isLoggedIn: false,
  // Load the user id, access token, and refresh token from secure store
  initAuthInfo: async () => {
    try {
      const userId = await getValueFor("userId");
      const accessToken = await getValueFor("accessToken");
      const refreshToken = await getValueFor("refreshToken");
      const role = await getValueFor("role");

      if (userId && accessToken && refreshToken) {
        set({
          userId: userId,
          accessToken: accessToken,
          refreshToken: refreshToken,
          role: role,
          isLoggedIn: true,
        });
      }
    } catch (error) {
      console.error("Failed to load auth info from secure store", error);
    }
  },
  fetchUserData: async (userId) => {
    set({ loading: true, error: null });
    try {
      // Validate userId
      if (!userId || !(typeof userId === "string" && /^[a-fA-F0-9]{24}$/.test(userId))) {
        throw new Error("Invalid userId format. It must be a 24-character hex string.");
      }

      const accessToken = await getValueFor("accessToken");
      console.log("Access Token:", accessToken);

      if (!accessToken) {
        throw new Error("Access token not found. Please log in again.");
      }

      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      console.log("Response status:", response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error("API Error Response:", errorData);
        throw new Error(errorData.message || "Failed to fetch user data.");
      }

      const userData = await response.json();
      console.log("Fetched User Data:", userData);

      set({ user: userData, loading: false });
    } catch (error) {
      console.error("Error fetching user data:", error.message);
      set({ user: null, error: error.message, loading: false });
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
  setRole: (role) => {
    set({
      role: role,
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
    await deleteValueFor("role");
    set({
      userId: null,
      accessToken: null,
      refreshToken: null,
      role: null,
      isLoggedIn: false,
    });
  },
}));

export default useSecureStore;
