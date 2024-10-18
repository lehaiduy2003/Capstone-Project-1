import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import BackButton from "./BackButton";
import { hp } from "../helpers/common";
import { theme } from "../constants/theme";
const Header = ({ title, showBackButton = false }) => {
  const router = useRouter();
  return (
    <View style={styles.container}>
      {showBackButton && (
        <View style={styles.backButton}>
          <BackButton router={router} />
        </View>
      )}
      <Text style={styles.title}>{title || ""}</Text>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 50,
    marginHorizontal: 20,
    marginVertical: 10,
  },
  title: {
    fontSize: hp(3),
    fontWeight: theme.fonts.semibold,
    color: theme.colors.textDark,
  },
  backButton: {
    position: "absolute",
    left: 0,
    backgroundColor: "#D1D5DB",
    height: 40,
    width: 40,
    borderRadius: 30,
  },
});
