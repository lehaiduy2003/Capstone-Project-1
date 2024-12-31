import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, StatusBar, Alert } from "react-native";
import OtpInputs from "../../components/UI/OtpInput";
import Button from "../../components/Button";
import LottieView from "lottie-react-native";
import ScreenWrapper from "../../components/ScreenWrapper";
import Header from "../../components/Header";
import { hp, wp } from "../../helpers/common";
import { theme } from "../../constants/theme";
import SuccessPopup from "../../components/UI/PopUp";
import { useRouter, useLocalSearchParams } from "expo-router";
import useSecureStore from "../../store/useSecureStore";
import { save } from "../../utils/secureStore";

const OTPVerificationScreen = () => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const router = useRouter();
  const { email, type, password } = useLocalSearchParams();
  const { initAuthInfo } = useSecureStore();

  const handleOtpChange = (value) => {
    setOtp(value);
  };

  const handleVerify = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/otp/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          identifier: email,
          otp: otp,
          type: type, // Add type for verification
        }),
      });

      const data = await response.json();
      console.log("API response:", data);

      if (type === "forgot") {
        if (data.message === "Otp verified") {
          // OTP verified, navigate to ResetPassword, passing email
          router.replace({
            pathname: "ResetPassword",
            params: { email },
          });
        } else {
          Alert.alert("Error", "Invalid OTP. Please try again.");
          return;
        }
      } else if (type === "activate") {
        if (data.message === "Otp verified") {
          // OTP verified, navigate to homepage
          const activate = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/auth/activate`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              identifier: email,
            }),
          });

          if (!activate.ok) {
            Alert.alert("Error", "An error occurred. Please try again.");
            return;
          }
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
          const data = await response.json();
          console.log("API response:", data);

          await save("accessToken", String(data.accessToken));
          await save("refreshToken", String(data.refreshToken));
          await save("user_id", String(data.user_id));
          await save("isLoggedIn", "true");

          await initAuthInfo();
          if (data.role === "recycler") {
            router.push("RecycleCampaign");
            return;
          } else {
            router.replace("HomePage");
          }
        } else {
          Alert.alert("Error", "Invalid OTP. Please try again.");
          return;
        }
      }
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClosePopup = () => {
    // Close the popup and navigate or perform any action as needed
    setIsPopupVisible(false);
    router.replace("SignIn");
  };

  return (
    <ScreenWrapper>
      <StatusBar style="dark" />
      {/* Header */}
      <Header showBackButton={true} />

      <View style={styles.container}>
        {/* Animation check */}
        <LottieView
          style={styles.animationMail}
          source={require("../../assets/animation/animation_mail_OTP.json")}
          autoPlay
          loop
        />
        <Text style={styles.title}>Verification Code</Text>
        <Text style={styles.description}>We have sent the code verification to</Text>
        <Text style={styles.email}>{email}</Text>

        <OtpInputs length={6} onOtpChange={handleOtpChange} />

        {/* Submit button */}
        <Button title="Submit" onPress={handleVerify} loading={loading} />

        <TouchableOpacity>
          <Text style={styles.resendText}>
            Didn’t receive the code? <Text style={styles.resendLink}>Resend</Text>
          </Text>
        </TouchableOpacity>
        {/* Success Popup */}
        <SuccessPopup visible={isPopupVisible} onClose={handleClosePopup} />
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: "#fff",
    paddingBottom: 250,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#000",
  },
  description: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#000",
    textAlign: "center",
    marginBottom: 20,
  },
  submitText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  resendText: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
  },
  resendLink: {
    color: theme.colors.primary,
    fontWeight: "bold",
  },
  animationMail: {
    height: hp(30),
    width: wp(100),
    alignItems: "center",
  },
});

export default OTPVerificationScreen;
