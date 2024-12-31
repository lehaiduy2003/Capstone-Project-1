import React from "react";
import { Tabs } from "expo-router";
import TabBar from "../../components/TabBar";

const _layoutNavigation = () => {
  return (
    <Tabs tabBar={(props) => <TabBar {...props} />}>
      <Tabs.Screen name="CustomerManagement" options={{ headerShown: false, title: "Customer" }} />
      <Tabs.Screen name="RecyclerManagement" options={{ headerShown: false, title: "Recycler" }} />
      <Tabs.Screen name="PostManagement" options={{ headerShown: false, title: "Post" }} />
      <Tabs.Screen name="Analytics" options={{ headerShown: false, title: "Analytics" }} />
      <Tabs.Screen name="AdminSetting" options={{ headerShown: false, title: "Settings" }} />
    </Tabs>
  );
};

export default _layoutNavigation;
