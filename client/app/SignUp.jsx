import { Alert, Pressable, StatusBar, StyleSheet, Text, View } from "react-native";
import Icon from "../assets/icons";
import BackButton from "../components/BackButton";
import Button from "../components/Button";
import ButtonGoogle from "../components/ButtonGoogle";
import Input from "../components/Input";
import ScreenWrapper from "../components/ScreenWrapper";
import { theme } from "../constants/theme";
import { hp, wp } from "../helpers/common";
import { useEffect, useState } from "react";
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
  const [loading, setLoading] = useState(false);

  const { initAuthInfo } = useSecureStore();
  const router = useRouter();

  // const { loading, onSubmit } = useAuthSubmit(`${process.env.EXPO_PUBLIC_API_URL}/auth/sign-up`);

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

  useEffect(() => {
    // Clear all fields when the component mounts
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setEmailError(false);
    setConfirmPasswordError(false);
  }, []);

  const handleSignUp = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert("Sign Up", "Please fill in all fields.");
      return;
    }
    if (emailError) {
      Alert.alert("Sign Up", "Please correct email in the form.");
      return;
    }
    if (password.length < 6) {
      Alert.alert("Sign Up", "Password must be at least 6 characters.");
      return;
    }
    if (confirmPasswordError) {
      Alert.alert("Sign Up", "Passwords do not match.");
      return;
    }
    try {
      setLoading(true);
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/auth/sign-up`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();
      // console.log("API response:", data);

      if (!response.ok) {
        Alert.alert("Sign Up", `An error occurred. ${data.message}`);
        setLoading(false);
        return;
      }

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
        Alert.alert("Sign Up", "An error occurred. Please try again.");
        setLoading(false);
        return;
      }

      setLoading(false);

      router.push({
        pathname: "Screens/otpScreen",
        params: { email: email, type: "activate", password: password },
      });
    } catch (error) {
      Alert.alert("Sign Up", "An error occurred. Please try again.");
    }
  };

  return (
    <ScreenWrapper bg={"white"}>
      <StatusBar style="dark" />
      <View style={styles.container}>
        <BackButton onPress={() => router.back()} />

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
          <View style={styles.divider} />
          <Pressable onPress={() => router.push("RecyclerSignUp")}>
            <Text
              style={[
                styles.footerText,
                {
                  color: theme.colors.primaryDark,
                  fontWeight: theme.fonts.semibold,
                },
              ]}
            >
              Create recycler account
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
    gap: 30,
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
  divider: {
    width: "80%",
    height: 1,
    alignSelf: "center",
    backgroundColor: "#000",
    marginVertical: 10,
  },
});
