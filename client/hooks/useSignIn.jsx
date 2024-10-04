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
    // Lấy giá trị từ các ref
    const email = emailRef.current.trim();
    const password = passwordRef.current.trim();

    // Kiểm tra xem email và mật khẩu đã được nhập hay chưa
    console.log(passwordRef.current);
    if (!email || !password) {
      Alert.alert("Sign In", "Please fill all fields");
      return;
    }

    const body = {
      email: email,
      password: password,
    };

    try {
      setLoading(true);
      const response = await fetchData(
        `${process.env.EXPO_PUBLIC_API_URL}/auth/sign-in`,
        body
      );
      // Xử lý phản hồi từ server
      if (response.ok) {
        const data = await response.json();
        // Lưu trữ token (accessToken, refreshToken)
        await Promise.all([
          save("accessToken", data.accessToken),
          save("refreshToken", data.refreshToken),
        ]);
        console.log("Tokens saved successfully");
        router.push("HomePage/homePage");
      } else {
        // Xử lý lỗi khi đăng nhập thất bại (ví dụ: sai email, mật khẩu)
        if (response.status === 401) {
          // Kiểm tra mã trạng thái 401 (Unauthorized)
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
