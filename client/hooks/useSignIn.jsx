// client/hooks/useSignIn.jsx
import { useState, useRef } from "react";
import { useRouter } from "expo-router";
import { Alert } from "react-native";
import { fetchData } from "../utils/fetch";
import { save } from "../utils/secureStore";

const useSignIn = () => {
  const router = useRouter();
  const emailRef = useRef("");
  const passwordRef = useRef("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    // Get values ​​from refs
    const email = emailRef.current.trim();
    const password = passwordRef.current.trim();

    // Check if email and password
    console.log(passwordRef.current);
    if (!email || !password) {
      Alert.alert("Sign In", "Please fill all fields");
      return;
    }

    const body = {
      email: email,
      password: password,
    };
    console.log(body);

    try {
      setLoading(true);
      const response = await fetchData(
        `${process.env.EXPO_PUBLIC_API_URL}auth/sign-in`,
        null,
        body
      );
      // Xử lý phản hồi từ server
      if (response.ok) {
        const data = await response.json();
        // Storage token (accessToken, refreshToken)
        await Promise.all([
          save("accessToken", data.accessToken),
          save("refreshToken", data.refreshToken),
        ]);
        console.log("Tokens saved successfully");
        router.push("(tabs)/homePage");
      } else {
        if (response.status === 401) {
          const errorData = await response.json();
          Alert.alert(
            "Sign In Error",
            errorData.error || "Invalid credentials"
          );
        } else {
          // Xử lý các lỗi khác (nếu cần)
          console.error("Sign in error:", response.status);
          Alert.alert("Sign In Error", "An error occurred. Please try again.");
        }
      }
    } catch (error) {
      console.error("Error during sign in:", error);
      Alert.alert("Sign In", "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return {
    emailRef,
    passwordRef,
    loading,
    onSubmit,
  };
};

export default useSignIn;
