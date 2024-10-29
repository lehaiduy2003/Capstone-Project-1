import { useEffect, useState } from "react";
import { fetchData, requestNewAccessToken } from "../utils/fetch";
import { getValueFor } from "../utils/secureStore";

// for fetching data from the server
export const useFetch = (url, options) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchApi = async () => {
      try {
        setLoading(true);
        let response = await fetchData(url, options);
        // If access token is expired, request a new one
        if (response.status === 401) {
          let accessToken;
          try {
            accessToken = await requestNewAccessToken();
            if (!accessToken) {
              throw new Error("Failed to get new access token");
            }
          } catch (error) {
            setError(error);
          }
          const newOptions = {
            ...options.methods,
            headers: {
              ...options.headers,
              authorization: `Bearer ${accessToken}`,
            },
            ...options.body,
          };
          // Retry the request with the new access token
          response = await fetchData(url, newOptions);
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
  }, [url, options]);

  return { data, error, loading };
};
