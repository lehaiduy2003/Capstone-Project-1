import React, { useState } from "react";
import { View, Text, StyleSheet, StatusBar, Alert } from "react-native";
import ScreenWrapper from "../components/ScreenWrapper";
import Button from "../components/Button";
import Input from "../components/Input";
import useAuthSubmit from "../hooks/useAuthSubmit";
import BackButton from "../components/BackButton";
import { getValueFor } from "../utils/secureStore";
import { useRouter } from "expo-router";
import Icon from "../assets/icons";
import { hp } from "../helpers/common";
import { theme } from "../constants/theme";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const router = useRouter();

  const { loading, error, onSubmit } = useAuthSubmit(
    `${process.env.EXPO_PUBLIC_API_URL}/profile/forgot-password`
  );

  const handleSubmit = async () => {
    if (!email) {
      Alert.alert("Error", "Please enter your email");
      return;
    }

    try {
      await onSubmit({
        headers: {
          "Content-Type": "application/json",
        },
        body: {
          email,
        },
      });
      if (error) {
        Alert.alert("Error", error.message);
        return;
      }

      const accessToken = await getValueFor("accessToken");

      // Fetch to /otp/send
      const otpResponse = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/otp/send`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      if (!otpResponse.ok) {
        Alert.alert("Error", "Failed to send OTP. Please try again.");
        return;
      }

      Alert.alert("Success", "Verification code sent to your email.");
      router.push("VerifyCode"); // Navigate to VerifyCode screen after success
    } catch (err) {
      Alert.alert("Error", err.message);
    }
  };

  return (
    <ScreenWrapper bg={"white"}>
      <StatusBar style="dark" />
      <View style={styles.container}>
        <StatusBar style="dark" />
        <BackButton router={router} />
        <Text style={styles.title}>Forgot Password</Text>
        <Text style={styles.subtitle}>
          Enter your email for the verification process. {"\n"}We will send 4
          digits code to your email.
        </Text>
        <View style={styles.form}>
          <Text style={styles.passText}>Email</Text>
          <Input
            icon={<Icon name="mail" size={26} strokeWidth={1.6} />}
            placeholder="Enter your email"
            onChangeText={setEmail}
          />
          <Button title="Send Code" onPress={handleSubmit} loading={loading} />
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

export default ForgotPassword;
