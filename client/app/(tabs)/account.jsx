import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  Dimensions,
} from "react-native";
import React from "react";
import { theme } from "../../constants/theme";
import { hp, wp } from "../../helpers/common";
import HeaderAcc from "../../components/Account/headerAcc";
import OrderMenu from "../../components/Account/orderMenu";
import OtherFeature from "../../components/Account/otherFeature";

const { height } = Dimensions.get("window");

const account = () => {
  return (
    <ScrollView style={styles.container}>
      {/* Phần Header */}
      <View style={styles.headerPart}>
        <HeaderAcc />
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
    height: height * 0.15, // Chiếm 20% chi
    backgroundColor: theme.colors.primary,
  },
  OrderMenu: {
    height: height * 0.25,
    backgroundColor: 'white',
  },
  OtherFeature: {
    flex: 1,
    backgroundColor:'white',
  },
  text: {

  },
  divider: {
    height: 1, // Độ dày của dòng
    backgroundColor: '#e0e0e0', // Màu của dòng chia cách
    marginVertical: 5, // Khoảng cách phía trên và dưới dòng chia cách
  },
});