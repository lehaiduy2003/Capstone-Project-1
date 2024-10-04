import { save, getValueFor } from "./secureStore";

export async function requestNewAccessToken() {
  try {
    const refreshToken = await getValueFor("refreshToken");
    const response = await fetch("/auth/refresh-access-token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${refreshToken}`,
      },
    });

    if (response.status === 401) {
      return null;
    }

    const json = await response.json();
    await save("accessToken", json.accessToken);
    return json.accessToken;
  } catch (error) {
    console.error("Error requesting new access token:", error);
    return null;
  }
}

export async function fetchData(url, token, body) {
  //console.log(body);

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authorization: token ? `Bearer ${token}` : null,
    },
    body: JSON.stringify(body),
  });
  return response;
}
