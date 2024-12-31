import React from "react";
import { Tabs } from "expo-router";
import TabBar from "../../components/TabBar";
import { CommonActions, useNavigation } from "@react-navigation/native";
import { Alert } from "react-native";
import { deleteValueFor, getValueFor } from "../../utils/secureStore";

const handleSignOut = async (navigation) => {
  Alert.alert(
    "Confirm Sign Out",
    "Are you sure you want to sign out?",
    [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Sign Out",
        onPress: async () => {
          await deleteValueFor("refreshToken");
          await deleteValueFor("userId");
          await deleteValueFor("accessToken");
          await deleteValueFor("user");
          await deleteValueFor("role");
          // console.log("Signing out...");

          await fetch(`${process.env.EXPO_PUBLIC_API_URL}/auth/sign-out`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${await getValueFor("accessToken")}`,
            },
            credentials: "include",
          });
          // console.log("Signed out");

          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: "SignIn" }],
            })
          );
        },
        style: "destructive",
      },
    ],
    { cancelable: true }
  );
};

const _layoutNavigation = () => {
  const icons = {
    RecycleCampaign: "recycle",
    ProductManagement: "home",
    RecyclerSetting: "user",
    AddNewCampaign: "plus",
  };
  const navigation = useNavigation();
  return (
    <Tabs tabBar={(props) => <TabBar icons={icons} {...props} />}>
      <Tabs.Screen name="RecycleCampaign" options={{ headerShown: false, title: "Campaign" }} />
      <Tabs.Screen name="QRScan" options={{ headerShown: false, title: "QR Scan" }} />
      <Tabs.Screen name="AddNewCampaign" options={{ headerShown: false, title: "Open Campaign" }} />
      <Tabs.Screen name="ProductManagement" options={{ headerShown: false, title: "Product" }} />
      <Tabs.Screen
        name="RecyclerSetting"
        options={{ headerShown: false, title: "Sign out" }}
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            handleSignOut(navigation);
          },
        }}
      />
    </Tabs>
  );
};

export default _layoutNavigation;
