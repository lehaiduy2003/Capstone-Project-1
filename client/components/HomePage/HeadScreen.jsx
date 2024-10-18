import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { hp, wp } from "../../helpers/common";
import { theme } from "../../constants/theme";
import Icon from "../../assets/icons";
import Search from "../Search";

function HeadScreen() {
  return (
    <View style={styles.header}>
      <Text style={styles.logoText}>Eco Trade</Text>
      <View style={styles.icons}>
        <Pressable>
          <Icon name={"cart"} size={hp(3.2)} strokeWidth={2} color={theme.colors.text} />
        </Pressable>
        <Pressable>
          <Icon name={"heart"} size={hp(3.2)} strokeWidth={2} color={theme.colors.text} />
        </Pressable>
      </View>

    </View>
    
  );
}

export default HeadScreen

const styles = StyleSheet.create({

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 50,
    marginHorizontal: wp(4),
    paddingTop: hp(2),
  },
  logoText: {
    fontSize: hp(3),
    fontWeight: theme.fonts.bold,
    color: theme.colors.text,
  },
  icons: {
    flexDirection: "row",
    gap: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 20,
  },
});