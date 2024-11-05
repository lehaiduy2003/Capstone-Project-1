import React, { useState } from "react";
import { View, Text, StyleSheet, StatusBar, Alert } from "react-native";
import ScreenWrapper from "../components/ScreenWrapper";
import Button from "../components/Button";
import InputPass from "../components/InputPass"; // Import InputPass
import useAuthSubmit from "../hooks/useAuthSubmit";
import BackButton from "../components/BackButton";
import { getValueFor } from "../utils/secureStore";
import { useRouter } from "expo-router";
import Icon from "../assets/icons";
import { hp } from "../helpers/common";
import { theme } from "../constants/theme";
import { useLocalSearchParams } from "expo-router"; // Add this line

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { email } = useLocalSearchParams(); // Get email from URL parameters

  const router = useRouter(); // Khởi tạo router

  // Sử dụng hook useAuthSubmit
  const { loading, error, onSubmit } = useAuthSubmit(
    `${process.env.EXPO_PUBLIC_API_URL}/auth/reset-password` // Make sure this is the correct endpoint.
  );

  const handleSubmit = async () => {
    if (!password || !confirmPassword) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    try {
      // Log email to verify it's received correctly
      console.log("Email from URL params:", email);

      const response = await onSubmit({
        method: "PATCH", // or PATCH, depending on your backend
        headers: {
          "Content-Type": "application/json",
          // Authorization: "Bearer <token>", if needed.
        },
        body: {
          identifier: email, // Use the retrieved email
          newPassword: password,
        },
      });

      console.log("Response", response);

      if (error) {
        Alert.alert("Error", error.message);
        return;
      }

      if (response && response.message === "password updated successfully") {
        // Kiểm tra message
        Alert.alert("Success", "Password reset successfully");
        router.push("SignIn");
      } else if (response && typeof response === "object" && response.message) {
        // Kiểm tra response object và message
        Alert.alert("Error", response.message || "Failed to reset password");
      } else {
        Alert.alert("Error", "An unexpected error occurred."); // Xử lý trường hợp response không như mong đợi.
      }
    } catch (err) {
      Alert.alert("Error", err.message);
    }
  };

  return (
    <ScreenWrapper bg={"white"}>
      <StatusBar style="dark" />
      <View style={styles.container}>
        <BackButton router={router} />
        <Text style={styles.title}>Reset Password</Text>
        <Text style={styles.subtitle}>
          Set the new password for your account so you {"\n"}
          can login and access all the features.
        </Text>
        <View style={styles.form}>
          <Text style={styles.passText}>Password</Text>
          <InputPass
            icon={<Icon name="lock" size={26} strokeWidth={1.6} />}
            placeholder="Password"
            onChangeText={setPassword}
            password={password}
            setPassword={setPassword} // Add this line to manage password visibility
          />
          <Text style={styles.passText}>Re-enter password</Text>
          <InputPass
            icon={<Icon name="lock" size={26} strokeWidth={1.6} />}
            placeholder="Re-enter password"
            onChangeText={setConfirmPassword}
            password={confirmPassword}
            setPassword={setConfirmPassword} // Add this line
          />
          <Button title="Continue" onPress={handleSubmit} loading={loading} />
        </View>
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "left",
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.textLight,
    marginBottom: 20,
    textAlign: "left",
  },
  form: {
    gap: 20,
  },
  passText: {
    fontSize: hp(1.8),
    fontWeight: theme.fonts.bold,
    color: theme.colors.text,
  },
});

export default ResetPassword;
