import { create } from "zustand";
import { getValueFor } from "../utils/secureStore";

const useUserStore = create((set) => ({
  user: null,
  loading: false,
  error: null,

  fetchUserData: async (userId) => {
    set({ loading: true, error: null });
    try {
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
}));

export default useUserStore;
