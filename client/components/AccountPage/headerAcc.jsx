import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import React from "react";
import { theme } from "../../constants/theme";
import { hp, wp } from "../../helpers/common";
import Icon from "../../assets/icons";
import { deleteValueFor } from "../../utils/secureStore";
import { CommonActions, useNavigation } from "@react-navigation/native";

const HeaderAcc = ({ user }) => {
  const navigation = useNavigation();

  const handleClick = (label) => {
    console.log(`Clicked: ${label}`);
  };

  const handleSignOut = async () => {
    try {
      await deleteValueFor("accessToken");
      await deleteValueFor("userId");
      await deleteValueFor("refreshToken");
      await deleteValueFor("user");
      await deleteValueFor("role");
      await fetch(`${process.env.EXPO_PUBLIC_API_URL}/auth/sign-out`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: "SignIn" }],
        })
      );
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const confirmLogout = () => {
    Alert.alert(
      "Confirm sign out",
      "Are you sure you want to sign out?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Sign out", onPress: () => handleSignOut() },
      ],
      { cancelable: false }
    );
  };

  return (
    <View style={styles.container}>
      {/* Left Header */}
      <View style={styles.leftHeader}>
        <TouchableOpacity onPress={() => handleClick("Change Avatar")}>
          <Icon
            style={{ marginLeft: wp(1) }}
            name="user"
            size={hp(6)}
            strokeWidth={2}
            color="white"
          />
        </TouchableOpacity>
        <View>
          <Text style={styles.userName}>{user?.name || "Guest"}</Text>
        </View>
      </View>
      {/* Right Header */}
      <View style={styles.rightHeader}>
        <TouchableOpacity onPress={() => handleClick("mail")}>
          <Icon name="messenger" size={hp(4)} strokeWidth={2} color="white" />
        </TouchableOpacity>
        <TouchableOpacity onPress={confirmLogout}>
          <Icon name="logout" size={hp(4)} strokeWidth={2} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default HeaderAcc;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: wp(4),
    paddingTop: hp(3),
    backgroundColor: theme.colors.primary,
  },
  leftHeader: {
    flexDirection: "row",
    alignItems: "center",
    flex: 2,
  },
  rightHeader: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    flex: 1,
  },
  userName: {
    fontSize: hp(2.2),
    fontWeight: "bold",
    color: "#fff",
    marginLeft: wp(2),
  },
});
