import { useState } from "react";
import { Alert } from "react-native";
import { fetchData } from "../utils/fetch";

// for sending data via form to the server
const useFormSubmit = (apiUrl, options) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const onSubmit = async () => {
    try {
      setLoading(true);
      console.log(options.body);

      const response = await fetchData(apiUrl, {
        method: "POST",
        body: options.body,
      });
      //console.log(response);
      const data = await response.json();
      if (!response.ok) {
        setError(data.error);
        return;
      }
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

export default useFormSubmit;
