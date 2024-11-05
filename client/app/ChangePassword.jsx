import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Alert,
  Pressable,
} from "react-native";
import ScreenWrapper from "../components/ScreenWrapper";
import InputPass from "../components/InputPass";
import Button from "../components/Button";
import useAuthSubmit from "../hooks/useAuthSubmit";
import BackButton from "../components/BackButton";
import { getValueFor } from "../utils/secureStore";
import { useRouter } from "expo-router";
import Icon from "../assets/icons";
import { hp } from "../helpers/common";
import { theme } from "../constants/theme";

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const router = useRouter(); // Khởi tạo router

  // Sử dụng hook useAuthSubmit
  const { loading, error, onSubmit } = useAuthSubmit(
    `${process.env.EXPO_PUBLIC_API_URL}/profile/change-password`
  );

  const handleSubmit = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "New password and confirm password don't match.");
      return;
    }

    const accessToken = await getValueFor("accessToken");

    try {
      await onSubmit({
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: {
          oldPassword,
          newPassword,
        },
      });
      if (error) {
        Alert.alert("Error", error.message);
        return;
      }
      Alert.alert("Success", "Password changed successfully.");
      router.back(); // Navigate back after success
    } catch (err) {
      Alert.alert("Error", err.message);
    }
  };

  //   try {
  //     const response = await onSubmit({
  //       headers: {
  //         Authorization: `Bearer ${accessToken}`,
  //       },
  //       body: {
  //         oldPassword,
  //         newPassword,
  //       },
  //     });

  //     console.log("API response:", response);

  //     if (error) {
  //       Alert.alert("Error", error.message);
  //       return;
  //     }
  //     if (response && response.message === "password updated successfully") {
  //       Alert.alert("Success", "Password changed successfully.");
  //       router.back(); // Navigate back after success
  //     } else {
  //       Alert.alert("Error", "Failed to change password.");
  //     }
  //   } catch (err) {
  //     Alert.alert("Error", err.message);
  //   }
  // };

  return (
    <ScreenWrapper bg={"white"}>
      <StatusBar style="dark" />
      <View style={styles.container}>
        <StatusBar style="dark" />
        <BackButton router={router} />
        <Text style={styles.title}>Change Password</Text>
        <View style={styles.horizontalLine} />
        <View style={styles.form}>
          <Text style={styles.passText}>Old Password</Text>
          <InputPass
            icon={<Icon name="lock" size={26} strokeWidth={1.6} />}
            placeholder="Old Password"
            // password={oldPassword}
            // setPassword={setOldPassword}
            onChangeText={setOldPassword}
          />
          <Text style={styles.passText}>New Password</Text>
          <InputPass
            icon={<Icon name="lock" size={26} strokeWidth={1.6} />}
            placeholder="New Password"
            // password={newPassword}
            // setPassword={setNewPassword}
            onChangeText={setNewPassword}
          />
          <Text style={styles.passText}>Confirm New Password</Text>
          <InputPass
            icon={<Icon name="lock" size={26} strokeWidth={1.6} />}
            placeholder="Confirm New Password"
            // password={confirmPassword}
            // setPassword={setConfirmPassword}
            onChangeText={setConfirmPassword}
          />
          <View style={styles.footer}>
            <Text style={styles.footerText}>Forgot your password? </Text>
            <Pressable onPress={() => router.push("ForgotPassword")}>
              <Text
                style={[
                  styles.footerText,
                  {
                    fontWeight: theme.fonts.semibold,
                    textDecorationLine: "underline", // Add underline
                  },
                ]}
              >
                Reset your password
              </Text>
            </Pressable>
          </View>
          <Button title="Submit" onPress={handleSubmit} loading={loading} />
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
    textAlign: "center",
  },
  form: {
    gap: 20,
  },
  horizontalLine: {
    borderBottomColor: "#ccc", // Adjust color as needed
    borderBottomWidth: 1,
    marginVertical: 20, // Adjust margin as needed
  },
  passText: {
    fontSize: hp(1.8),
    fontWeight: theme.fonts.bold,
    color: theme.colors.text,
  },
  footer: {
    flexDirection: "row", // Đặt các phần tử trong footer trên cùng một dòng
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  footerText: {
    color: theme.colors.dark,
    fontSize: hp(1.6),
  },
});

export default ChangePassword;
