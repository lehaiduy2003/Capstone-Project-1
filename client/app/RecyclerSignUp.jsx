import { Alert, Pressable, StatusBar, StyleSheet, Text, View } from "react-native";
import Icon from "../assets/icons";
import BackButton from "../components/BackButton";
import Button from "../components/Button";
import Input from "../components/Input";
import ScreenWrapper from "../components/ScreenWrapper";
import { theme } from "../constants/theme";
import { hp, wp } from "../helpers/common";
import { useEffect, useState } from "react";
import InputPass from "../components/InputPass";
import { emailIsValid, passwordMatches, phoneIsValid } from "../utils/inputValidation";
import { save } from "../utils/secureStore";
import { useRouter } from "expo-router";
import useSecureStore from "../store/useSecureStore";

const RecyclerSignUp = () => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState(false);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
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

  const onChangePhone = (value) => {
    setPhone(value);
    phoneIsValid(value) ? setPhoneError(false) : setPhoneError(true);
  };

  const onChangeName = (value) => {
    setName(value);
  };

  const onChangeAddress = (value) => {
    setAddress(value);
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
    setPhone("");
    setPhoneError(false);
    setAddress("");
    setConfirmPassword("");
    setEmailError(false);
    setConfirmPasswordError(false);
    setLoading(false);
  }, []);

  const handleRecyclerSignUp = async () => {
    if (!email || !phone || !name || !address || !password || !confirmPassword) {
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
    if (phoneError) {
      Alert.alert("Sign Up", "Please enter a valid phone number.");
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
          phone,
          name,
          address,
          role: "recycler",
        }),
      });

      if (!response.ok) {
        Alert.alert("Sign Up", "An error occurred. Please try again.");
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
        <BackButton
          onPress={() => {
            router.back();
          }}
        />

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
          <Input
            icon={<Icon name="call" size={26} strokeWidth={1.6} />}
            placeholder="+XX123XXX45"
            onChangeText={onChangePhone}
          />
          <Input
            icon={<Icon name="user" size={26} strokeWidth={1.6} />}
            placeholder="Enter your organization name"
            onChangeText={onChangeName}
            emailStatus={emailError}
          />
          <Input
            icon={<Icon name="location" size={26} strokeWidth={1.6} />}
            placeholder="Enter your address"
            onChangeText={onChangeAddress}
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
          <Button title="Sign Up" onPress={handleRecyclerSignUp} loading={loading} />
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
export default RecyclerSignUp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 10,
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
