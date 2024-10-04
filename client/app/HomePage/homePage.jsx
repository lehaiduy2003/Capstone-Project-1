import { View, Text, StyleSheet, StatusBar, Pressable } from "react-native";
import React from "react";
import ScreenWrapper from "../../components/ScreenWrapper";
import { hp, wp } from "../../helpers/common";
import { theme } from "../../constants/theme";
import Icon from "../../assets/icons";
import Search from "../../components/Search";
import { getValueFor } from "../../utils/secureStore";

const homePage = () => {
  const getToken = async () => {
    const accessToken = await getValueFor("accessToken");
    const refreshToken = await getValueFor("refreshToken");
    console.log(
      "\naccess token: ",
      accessToken,
      "\nrefresh token: ",
      refreshToken
    );
  };
  getToken();

  return (
    <ScreenWrapper bg={"white"}>
      <StatusBar style="dark" />
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.logoText}>Eco Trade</Text>
          <View style={styles.icons}>
            <Pressable>
              <Icon
                name={"cart"}
                size={hp(3.2)}
                strokeWidth={2}
                color={theme.colors.text}
              />
            </Pressable>
            <Pressable>
              <Icon
                name={"heart"}
                size={hp(3.2)}
                strokeWidth={2}
                color={theme.colors.text}
              />
            </Pressable>
          </View>
        </View>
        {/* Search */}
        <View>
          <Search
            icon={<Icon name="search" size={26} strokeWidth={1.6} />}
            placeholder="Search products, brands..."
            onChangeText={(value) => (nameRef.current = value)}
          />
        </View>
        <View>
          <Text>Home Page</Text>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default homePage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: wp(4),
  },
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
});
