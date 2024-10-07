import { useEffect, useState } from "react";
import { fetchApi, requestNewAccessToken } from "../utils/fetch";
import { getValueFor } from "../utils/secureStore";

// for fetching data from the server
export const useFetch = (url, body) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApi = async () => {
      try {
        setLoading(true);
        let accessToken = await getValueFor("accessToken");
        if (!accessToken) {
          throw new Error("Access token not found");
        }
        let response = await fetchData(url, accessToken, body);

        // If access token is expired, request a new one
        if (response.status === 401) {
          try {
            accessToken = await requestNewAccessToken();
            if (!accessToken) {
              throw new Error("Failed to get new access token");
            }
          } catch (error) {
            setError(error);
          }
          // Retry the request with the new access token
          response = await fetchData(url, accessToken, body);
        }
        const json = await response.json();
        setData(json);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchApi();
  }, [url, body]);

  return { data, error, loading };
};
