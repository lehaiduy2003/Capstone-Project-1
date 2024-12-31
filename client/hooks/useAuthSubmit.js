import { useState } from "react";

// for sending data via form to the server
const useAuthSubmit = (apiUrl) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const onSubmit = async (options) => {
    try {
      setLoading(true);
      // console.log(options.body);
      const response = await fetch(apiUrl, {
        // method: "POST",
        method: options.method || "POST", // Lấy method từ options, mặc định là POST
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        body: JSON.stringify(options.body),
      });

      const jsonData = await response.json();
      // console.log(jsonData);

      if (!response.ok) {
        setError({ message: jsonData.message, success: false });
        return null;
      }
      // console.log(jsonData);
      return jsonData;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    onSubmit,
  };
};

export default useAuthSubmit;
