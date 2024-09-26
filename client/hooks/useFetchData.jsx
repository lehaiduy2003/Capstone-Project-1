// import { useEffect, useState } from "react";
// import { fetchApi, requestNewAccessToken } from "../utils/fetch";
// import { getValueFor } from "../utils/secureStore";

// // for fetching data from the server
// export const useFetch = (url, body) => {
//   const [data, setData] = useState(null);
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         let accessToken = await getValueFor("accessToken");
//         let response = await fetchApi(url, accessToken, body);

//         // If access token is expired, request a new one
//         if (response.status === 401) {
//           const refreshToken = await getValueFor("refreshToken");
//           const newAccessToken = await requestNewAccessToken(refreshToken);

//           // If refresh token is expired, throw an error
//           if (!newAccessToken) {
//             throw new Error("Unauthorized");
//           }

//           // Retry the request with the new access token
//           accessToken = newAccessToken;
//           response = await fetchApi(url, accessToken, body);
//         }

//         const json = await response.json();
//         setData(json);
//       } catch (error) {
//         setError(error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [url, body]);

//   return { data, error, loading };
// };
