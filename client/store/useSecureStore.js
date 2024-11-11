import { create } from "zustand";
import { getValueFor } from "../utils/secureStore";

const useSecureStore = create((set) => ({
  userId: null,
  accessToken: null,
  refreshToken: null,
  setAuthInfo: async () =>
    set({
      userId: await getUserId(),
      accessToken: await getAccessToken(),
      refreshToken: await getRefreshToken(),
    }),
  signIn: (id, accessToken, refreshToken) => {
    set({
      userId: id,
      accessToken: accessToken,
      refreshToken: refreshToken,
    });
  },
  resetAuthInfo: () =>
    set({
      user: null,
      accessToken: null,
      refreshToken: null,
    }),
}));

const getUserId = async () => {
  const userId = await getValueFor("user_id");
  return userId ? userId : null;
};

const getAccessToken = async () => {
  const accessToken = await getValueFor("accessToken");
  return accessToken ? accessToken : null;
};

const getRefreshToken = async () => {
  const refreshToken = await getValueFor("refreshToken");
  return refreshToken ? refreshToken : null;
};

export default useSecureStore;
