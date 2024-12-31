import React, { useEffect, useState } from "react";
import { Alert, BackHandler, Pressable, StatusBar, StyleSheet, Text, View } from "react-native";
import Icon from "../assets/icons";
import BackButton from "../components/BackButton";
import Button from "../components/Button";
import ButtonGoogle from "../components/ButtonGoogle";
import Input from "../components/Input";
import InputPass from "../components/InputPass";
import ScreenWrapper from "../components/ScreenWrapper";
import { theme } from "../constants/theme";
import { hp, wp } from "../helpers/common";
import { useRouter } from "expo-router";
import { save } from "../utils/secureStore";
import useAuthSubmit from "../hooks/useAuthSubmit";
import useSecureStore from "../store/useSecureStore";
import { CommonActions, useFocusEffect, useNavigation } from "@react-navigation/native";

const SignIn = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { initAuthInfo } = useSecureStore();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Clear all fields when the component mounts
    setEmail("");
    setPassword("");
  }, []);

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert("Sign In", "Please fill in all fields.");
      return;
    }
    try {
      setLoading(true);
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/auth/sign-in`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });
      if (response.status === 400) {
        Alert.alert("Sign In", "Invalid credentials. Please try again.");
        setLoading(false);
        return;
      }

      if (response.status === 500) {
        Alert.alert("Sign In", "Account not found. Please sign up.");
        setLoading(false);
        return;
      }

      if (response.status === 401) {
        const sendOtpResponse = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/otp/send`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            identifier: email,
            type: "activate",
          }),
        });

        if (!sendOtpResponse.ok) {
          Alert.alert("Sign Up", "Cannot send OTP for activate account. Please try again.");
          setLoading(false);
          return;
        }
        setLoading(false);
        router.push({
          pathname: "Screens/otpScreen",
          params: { email, type: "activate", password },
        });
        return;
      }

      const data = await response.json();
      // console.log(data);

      const accessToken = String(data.accessToken);
      const refreshToken = String(data.refreshToken);
      const userId = String(data.user_id);
      const role = String(data.role);

      // Lưu thông tin vào Secure Storage
      await save("accessToken", accessToken);
      await save("refreshToken", refreshToken);
      await save("userId", userId);
      await save("isLoggedIn", "true");
      await save("role", role);
      // console.log("Role:", role);
      await initAuthInfo();

      if (data.role === "recycler") {
        router.replace({
          pathname: "RecycleCampaign",
          params: { role: "recycler" },
        });
        return;
      } else if (data.role === "admin") {
        router.replace({
          pathname: "CustomerManagement",
          params: { role: "admin" },
        });
        return;
      }
      router.replace("HomePage");
    } catch (error) {
      setLoading(false);
      Alert.alert("Sign In", "An error occurred. Please try again.");
    }
  };

  return (
    <ScreenWrapper bg={"white"}>
      <StatusBar style="dark" />
      <View style={styles.container}>
        <BackButton
          onPress={() => {
            router.back();
          }}
        />

        {/* Welcome */}
        <View>
          <Text style={styles.welcomeText}>Hey!</Text>
          <Text style={styles.welcomeText}>Welcome Back</Text>
        </View>
        {/* Form */}
        <View style={styles.form}>
          <Text style={{ fontSize: hp(1.5), color: theme.colors.text }}>
            Please login to continue
          </Text>
          <Input
            icon={<Icon name="mail" size={26} strokeWidth={1.6} />}
            placeholder="Enter your email"
            onChangeText={(value) => setEmail(value)}
          />
          <InputPass
            icon={<Icon name="lock" size={26} strokeWidth={1.6} />}
            placeholder="Enter your password"
            onChangeText={(value) => setPassword(value)}
          />

          <Pressable onPress={() => router.push("ForgotPassword")}>
            <Text style={styles.forgotPassword}>Forgot Password?</Text>
          </Pressable>
          {/* Button */}
          <Button title={"Sign In"} loading={loading} onPress={handleSignIn} />
          <Text style={styles.footerText}>Or using other method</Text>
          {/* Google Button */}
          <ButtonGoogle icon={<Icon name="google" />} title={"   Sign in with Google"} />
        </View>
        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account?</Text>
          <Pressable onPress={() => router.push("SignUp")}>
            <Text
              style={[
                styles.footerText,
                {
                  color: theme.colors.primaryDark,
                  fontWeight: theme.fonts.semibold,
                },
              ]}
            >
              Sign Up
            </Text>
          </Pressable>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default SignIn;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 45,
    paddingHorizontal: wp(5),
  },
  welcomeText: {
    fontSize: hp(4),
    fontWeight: theme.fonts.bold,
    color: theme.colors.text,
  },
  form: {
    gap: 20,
  },
  forgotPassword: {
    textAlign: "right",
    fontWeight: theme.fonts.semibold,
    color: theme.colors.text,
  },
  footer: {
    textAlign: "center",
    color: theme.colors.text,
    fontSize: hp(1.6),
  },
  footerText: {
    textAlign: "center",
    color: theme.colors.text,
    fontSize: hp(1.6),
  },
});
