import { useState, useRef } from "react";
import { useRouter } from "expo-router";
import { Alert } from "react-native";
import { fetchData } from "../utils/fetch";
import { save } from "../utils/secureStore";

// for sending data via form to the server
const useFormAction = (apiUrl) => {
  const router = useRouter();
  const nameRef = useRef("");
  const emailRef = useRef("");
  const passwordRef = useRef("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    if (!nameRef.current || !emailRef.current || !passwordRef.current) {
      Alert.alert("Sign Up", "Please fill all fields");
      return;
    }

    const body = {
      name: nameRef.current.trim(),
      email: emailRef.current.trim(),
      password: passwordRef.current.trim(),
    };

    try {
      setLoading(true);
      const response = await fetchData(`${apiUrl}`, body);
      const data = await response.json();
      //console.log(data);

      await Promise.all([
        save("accessToken", data.accessToken),
        save("refreshToken", data.refreshToken),
      ]);

      console.log("Tokens saved successfully");
      router.push("HomePage/homePage");
    } catch (error) {
      console.error("Error during sign up:", error);
      Alert.alert("Sign Up", "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return {
    router,
    nameRef,
    emailRef,
    passwordRef,
    loading,
    onSubmit,
  };
};

export default useFormAction;
