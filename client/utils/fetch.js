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

export async function fetchData(url, body) {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  return response;
}

// export async function fetchApi(url, body) {
//   let accessToken = await getValueFor("accessToken");

//   const makeRequest = async (token) => {
//     const response = await fetch(url, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         authorization: `Bearer ${token}`,
//       },
//       body: JSON.stringify(body),
//     });
//     return response;
//   };

//   try {
//     let response = await makeRequest(accessToken);

//     // If access token is expired, request a new one
//     if (response.status === 401) {
//       const refreshToken = await getValueFor("refreshToken");
//       const newAccessToken = await requestNewAccessToken(refreshToken);

//       // If refresh token is expired, throw an error
//       if (!newAccessToken) {
//         throw new Error("Unauthorized");
//       }

//       accessToken = newAccessToken;
//       response = await makeRequest(accessToken);
//     }

//     const json = await response.json();
//     return json;
//   } catch (error) {
//     console.error("Error fetching API:", error);
//     throw new Error(error.message || "An error occurred");
//   }
// }
