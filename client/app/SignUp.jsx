import { Alert, Pressable, StatusBar, StyleSheet, Text, View } from "react-native";
import Icon from "../assets/icons";
import BackButton from "../components/BackButton";
import Button from "../components/Button";
import ButtonGoogle from "../components/ButtonGoogle";
import Input from "../components/Input";
import ScreenWrapper from "../components/ScreenWrapper";
import { theme } from "../constants/theme";
import { hp, wp } from "../helpers/common";
import { useState } from "react";
import InputPass from "../components/InputPass";
import { emailIsValid, passwordMatches } from "../utils/inputValidation";
import useAuthSubmit from "../hooks/useAuthSubmit";
import { save } from "../utils/secureStore";
import { useRouter } from "expo-router";
import useSecureStore from "../store/useSecureStore";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState(false);

  const { initAuthInfo } = useSecureStore();
  const router = useRouter();

  const { loading, onSubmit } = useAuthSubmit(`${process.env.EXPO_PUBLIC_API_URL}/auth/sign-up`);

  const onChangeEmail = (value) => {
    setEmail(value);
    emailIsValid(value) ? setEmailError(false) : setEmailError(true);
    //console.log(emailError);
  };

  const onChangePassword = (value) => {
    setPassword(value);
    if (confirmPassword) {
      passwordMatches(value, confirmPassword)
        ? setConfirmPasswordError(false)
        : setConfirmPasswordError(true);
    }
  };

  const onChangeConfirmPassword = (value) => {
    setConfirmPassword(value);
    passwordMatches(password, value)
      ? setConfirmPasswordError(false)
      : setConfirmPasswordError(true);
    console.log(confirmPasswordError);
  };

  const handleSignUp = async () => {
    try {
      const data = await onSubmit({
        body: { email: email, password: password },
      });

      const accessToken = String(data.accessToken);
      const refreshToken = String(data.refreshToken);
      const userId = String(data.user_id);

      // console.log(accessToken, refreshToken, userId);
      await save("accessToken", accessToken);
      await save("refreshToken", refreshToken);
      await save("user_id", userId);
      await save("isLoggedIn", "true");

      await initAuthInfo();

      console.log("Tokens saved successfully");
      router.push("(tabs)/HomePage");
    } catch (error) {
      Alert.alert("Sign Up", "An error occurred. Please try again.");
    }
  };

  return (
    <ScreenWrapper bg={"white"}>
      <StatusBar style="dark" />
      <View style={styles.container}>
        <BackButton router={router} />

        {/* Welcome */}
        <View>
          <Text style={styles.welcomeText}>Let's</Text>
          <Text style={styles.welcomeText}>Get Started</Text>
        </View>
        {/* Form */}
        <View style={styles.form}>
          <Text style={{ fontSize: hp(1.5), color: theme.colors.text }}>
            Please fill the details to create an account
          </Text>
          <Input
            icon={<Icon name="mail" size={26} strokeWidth={1.6} />}
            placeholder="Enter your email"
            onChangeText={onChangeEmail}
            emailStatus={emailError}
          />
          <InputPass
            icon={<Icon name="lock" size={26} strokeWidth={1.6} />}
            iconRight={<Icon name="viewOn" size={26} strokeWidth={1.6} />}
            placeholder="Enter your password"
            onChangeText={onChangePassword}
          />
          <InputPass
            icon={<Icon name="lock" size={26} strokeWidth={1.6} />}
            iconRight={<Icon name="viewOn" size={26} strokeWidth={1.6} />}
            placeholder="Confirm your password"
            onChangeText={onChangeConfirmPassword}
          />
          <Button title="Sign Up" onPress={handleSignUp} loading={loading} />
          <Text style={styles.footerText}>Or using other method</Text>
          {/* Google Button */}
          <ButtonGoogle icon={<Icon name="google" />} title={"   Sign up with Google"} />
        </View>
        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account?</Text>
          <Pressable onPress={() => router.push("SignIn")}>
            <Text
              style={[
                styles.footerText,
                {
                  color: theme.colors.primaryDark,
                  fontWeight: theme.fonts.semibold,
                },
              ]}
            >
              Sign In
            </Text>
          </Pressable>
        </View>
      </View>
    </ScreenWrapper>
  );
};
export default SignUp;

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
