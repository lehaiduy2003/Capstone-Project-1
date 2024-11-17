import { useState } from "react";
import { Alert } from "react-native";

// for sending data via form to the server
const useAuthSubmit = (apiUrl) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const onSubmit = async (options) => {
    try {
      setLoading(true);
      // console.log(options.body);
      const response = await fetch(apiUrl, {
        method: options.method || "POST", // Lấy method từ options, mặc định là POST
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        body: JSON.stringify(options.body),
      });
      if (!response.ok) {
        setError({ code: response.status, message: response.body });
        return null;
      }
      const jsonData = await response.json();
      return jsonData;
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
