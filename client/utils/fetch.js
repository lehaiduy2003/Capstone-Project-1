import urlencoded from "./formURLencoded";
import { save, getValueFor } from "./secureStore";

/**
 * @returns {Promise<string>} - Access token
 * @description Request a new access token from the server
 */
export async function requestNewAccessToken() {
  try {
    const refreshToken = await getValueFor("refreshToken");
    const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/auth/refresh`, {
      method: "POST",
      headers: {
        authorization: `Bearer ${refreshToken}`,
      },
    });

    if (response.status === 401) {
      return null;
    }

    const json = await response.json();
    await save("accessToken", String(json.accessToken));
    return json.accessToken;
  } catch (error) {
    console.error("Error requesting new access token:", error);
    return null;
  }
}

export async function fetchData(url, options) {
  if (!options) {
    options = {};
  }

  const response = await fetch(url, {
    ...options.method,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...(options.body ? { body: JSON.stringify(options.body) } : {}),
  });
  return response;
}
