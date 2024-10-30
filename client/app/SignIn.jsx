import React, { useRef } from "react";
import { Pressable, StatusBar, StyleSheet, Text, View } from "react-native";
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

const SignIn = () => {
  const email = useRef("");
  const password = useRef("");
  const router = useRouter();
  const { loading, error, onSubmit } = useAuthSubmit(
    `${process.env.EXPO_PUBLIC_API_URL}/auth/sign-in`,
    {},
  );

  const handleSignIn = async () => {
    const data = await onSubmit({
      body: { email: email.current, password: password.current },
    });
    if (error) {
      console.error(error);
      return;
    }
    if (!data) {
      console.error("Data is empty");
      return;
    }
    await save("accessToken", String(data.accessToken));
    await save("refreshToken", String(data.refreshToken));
    await save("user_id", String(data.user_id));
    await save("isLoggedIn", "true");

    console.log("Tokens saved successfully");
    router.push("(tabs)/homePage");
  };

  return (
    <ScreenWrapper bg={"white"}>
      <StatusBar style="dark" />
      <View style={styles.container}>
        <BackButton router={router} />

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
            onChangeText={(value) => (email.current = value)}
          />
          <InputPass
            icon={<Icon name="lock" size={26} strokeWidth={1.6} />}
            placeholder="Enter your password"
            password={password.current}
            onChangeText={(value) => {
              password.current = value;
            }}
          />

          <Text style={styles.forgotPassword}>Forgot Password?</Text>
          {/* Button */}
          <Button title={"Sign In"} loading={loading} onPress={handleSignIn} />
          {/* <Button title={"Sign In"} loading={loading} onPress={router.push('(tabs)/homePage')} /> */}

          <Text style={styles.footerText}>Or using other method</Text>
          {/* Google Button */}
          <ButtonGoogle
            icon={<Icon name="google" />}
            title={"   Sign in with Google"}
          />
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
