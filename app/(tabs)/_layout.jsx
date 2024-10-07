import React from "react";
import { Tabs } from "expo-router";
import TabBar from "../../components/TabBar";

const _layoutNavigation = () => {
  return (
    <Tabs tabBar={(props) => <TabBar {...props} />}>
      <Tabs.Screen
        name="cart"
        options={{ headerShown: false, title: "Cart" }}
      />
      <Tabs.Screen
        name="orders"
        options={{ headerShown: false, title: "Orders" }}
      />
      <Tabs.Screen
        name="homePage"
        options={{ headerShown: false, title: "Home" }}
      />
      <Tabs.Screen
        name="wallet"
        options={{ headerShown: false, title: "Wallet" }}
      />
      <Tabs.Screen
        name="account"
        options={{ headerShown: false, title: "Account" }}
      />
    </Tabs>
  );
};

export default _layoutNavigation;
