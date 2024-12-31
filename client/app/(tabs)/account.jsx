import React, { useEffect } from "react";
import { View, ScrollView, StyleSheet, Text } from "react-native";
import { theme } from "../../constants/theme";
import HeaderAcc from "../../components/AccountPage/headerAcc";
import OrderMenuCustomer from "../../components/AccountPage/orderMenuCustomer";
import OtherFeature from "../../components/AccountPage/otherFeature";
import useSecureStore from "../../store/useSecureStore";
import useUserStore from "../../store/useUserStore";
import { usePathname } from "expo-router";

const account = () => {
  const { userId } = useSecureStore();
  const { user, fetchUserData, loading, error } = useUserStore();
  // const path = usePathname();
  useEffect(() => {
    if (userId) {
      console.log("User ID:", userId);
      fetchUserData(userId);
    }
    // console.log("Pathname: ", path);
  }, [userId]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header Section */}
      <View style={styles.headerPart}>
        <HeaderAcc user={user} />
      </View>

      {/* Order Menu Section */}
      <View style={styles.orderMenu}>
        <OrderMenuCustomer />
      </View>
      <View style={styles.divider} />

      {/* Other Features Section */}
      <View style={styles.otherFeature}>
        <OtherFeature />
      </View>
      <View style={styles.divider} />
    </ScrollView>
  );
};

export default account;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerPart: {
    backgroundColor: theme.colors.primary,
    paddingBottom: 20,
  },
  orderMenu: {
    backgroundColor: "white",
  },
  otherFeature: {
    flex: 1,
    backgroundColor: "white",
  },
  divider: {
    height: 1,
    backgroundColor: "#e0e0e0",
    marginVertical: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    color: theme.colors.textSecondary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 16,
    color: "red",
  },
});
