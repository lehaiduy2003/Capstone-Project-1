import React from "react";
import { View, StyleSheet } from "react-native";
import DashboardSidebar from "../../components/Dashboard/DashBoardSideBar";

const AdminSetting = () => {
  return (
    <View style={styles.container}>
      {/* Sidebar */}
      <DashboardSidebar />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});

export default AdminSetting;
