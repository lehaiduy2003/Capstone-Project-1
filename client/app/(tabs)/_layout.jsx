import React from "react";
import { Tabs } from "expo-router";
import TabBar from "../../components/TabBar";

const _layoutNavigation = () => {
  const icons = {
    DonateRecycle: "recycle",
    HomePage: "home",
    Post: "comment",
    account: "user",
  };
  return (
    <Tabs tabBar={(props) => <TabBar icons={icons} {...props} />}>
      <Tabs.Screen name="HomePage" options={{ headerShown: false, title: "Home" }} />
      <Tabs.Screen name="Post" options={{ headerShown: false, title: "Post" }} />
      <Tabs.Screen
        name="DonateRecycle"
        options={{ headerShown: false, title: "Recycle Campaign" }}
      />
      <Tabs.Screen name="account" options={{ headerShown: false, title: "Account" }} />
    </Tabs>
  );
};

export default _layoutNavigation;
