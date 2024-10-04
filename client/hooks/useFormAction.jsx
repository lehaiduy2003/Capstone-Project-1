import { useState, useRef } from "react";
import { useRouter } from "expo-router";
import { Alert } from "react-native";
import { fetchData } from "../utils/fetch";
import { save } from "../utils/secureStore";
import { passwordMatches } from "../utils/inputValidation";

// for sending data via form to the server
const useFormAction = (apiUrl, email, password, confirmPassword) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert("Sign Up", "Please fill all fields");
      return;
    }

    if (!passwordMatches(password, confirmPassword)) {
      Alert.alert("Sign Up", "Passwords do not match");
      return;
    }

    const body = {
      email: email,
      password: confirmPassword,
    };
    console.log(body);

    try {
      setLoading(true);
      const response = await fetchData(`${apiUrl}`, null, body);
      //console.log(response);
      const data = await response.json();
      if (!response.ok) {
        console.log(data.error);
        Alert.alert("Sign Up", data.error);
        return;
      }
      //console.log(data.accessToken);
      //console.log(data.refreshToken);
      await save("accessToken", data.accessToken);
      await save("refreshToken", data.refreshToken);

      console.log("Tokens saved successfully");
      router.push("(tabs)/homePage");
    } catch (error) {
      console.error("Error during sign up:", error);
      Alert.alert("Sign Up", "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return {
    router,
    loading,
    onSubmit,
  };
};

export default useFormAction;
