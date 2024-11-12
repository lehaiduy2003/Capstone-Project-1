import { View, ScrollView, StyleSheet, Dimensions } from "react-native";
import React, { useEffect, useState } from "react";
import { theme } from "../../constants/theme";
import HeaderAcc from "../../components/AccountPage/headerAcc";
import OrderMenu from "../../components/AccountPage/orderMenu";
import OtherFeature from "../../components/AccountPage/otherFeature";
import useSecureStore from "../../store/useSecureStore";

const { height } = Dimensions.get("window");

const account = () => {
  const userId = useSecureStore((state) => state.userId);
  const [user, setUser] = useState(null);

  return (
    <ScrollView style={styles.container}>
      {/* Phần Header */}
      <View style={styles.headerPart}>
        <HeaderAcc user={user} />
      </View>

      {/* Phần Order Menu */}
      <View style={styles.OrderMenu}>
        <OrderMenu />
      </View>
      <View style={styles.divider} />
      {/* Phần 3 - Cuộn được chiếm phần còn lại */}
      <View style={styles.OtherFeature}>
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
    height: height * 0.16, // Chiếm 20% chi
    backgroundColor: theme.colors.primary,
  },
  OrderMenu: {
    height: height * 0.25,
    backgroundColor: "white",
  },
  OtherFeature: {
    flex: 1,
    backgroundColor: "white",
  },
  text: {},
  divider: {
    height: 1, // Độ dày của dòng
    backgroundColor: "#e0e0e0", // Màu của dòng chia cách
    marginVertical: 5, // Khoảng cách phía trên và dưới dòng chia cách
  },
});
