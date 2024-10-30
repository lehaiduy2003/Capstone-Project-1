import { useState } from "react";
import { Alert } from "react-native";
import { fetchData } from "../utils/fetch";

// for sending data via form to the server
const useAuthSubmit = (apiUrl) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const onSubmit = async (options) => {
    try {
      setLoading(true);
      console.log(options.body);
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(options.body),
      });
      if (!response.ok) {
        setError({ code: response.status, message: response.body });
        return null;
      }
      return await response.json();
    } catch (error) {
      Alert.alert("Form Submitting", "An error occurred. Please try again.");
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    onSubmit,
  };
};

export default useAuthSubmit;
