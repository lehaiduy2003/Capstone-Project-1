import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Alert,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Icon from "../assets/icons";
import BackButton from "../components/BackButton";
import Button from "../components/Button";
import ButtonGoogle from "../components/ButtonGoogle";
import Input from "../components/Input";
import InputPass from "../components/InputPass";
import ScreenWrapper from "../components/ScreenWrapper";
import { theme } from "../constants/theme";
import { hp, wp } from "../helpers/common";

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = () => {
    // if (!emailRef.current || !passwordRef.current) {
    //   Alert.alert("Login", "Please fill all fields");
    //   return;
    // } else {
    //   router.push("../(tabs)/homePage");
    // }

    // let email = emailRef.current.trim();
    // let password = passwordRef.current.trim();
    // setLoading(false);
    console.log(password);
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
            onChangeText={(value) => setEmail(value)}
          />
          <InputPass
            icon={<Icon name="lock" size={26} strokeWidth={1.6} />}
            iconRight={<Icon name="viewOn" size={26} strokeWidth={1.6} />}
            placeholder="Enter your password"
            onChangeText={(value) => setPassword(value)}
          />

          <Text style={styles.forgotPassword}>Forgot Password?</Text>
          {/* Button */}
          <Button title={"Login"} loading={loading} onPress={onSubmit} />
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
          <Pressable onPress={() => router.push("signUp")}>
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

export default Login;

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
