import { View, Text, StyleSheet, StatusBar, Pressable } from "react-native";
import React, { useEffect } from "react";
import ScreenWrapper from "../../components/ScreenWrapper";
import { hp, wp } from "../../helpers/common";
import { theme } from "../../constants/theme";
import Icon from "../../assets/icons";
import Search from "../../components/Search";
import { router } from "expo-router";
import usePagination from "../../hooks/usePagination";
import ProductList from "../../components/ProductList";
import { SafeAreaView } from "react-native-safe-area-context";

const homePage = () => {
  const nameRef = React.useRef("");

  const { products, isLoading, fetchProducts, onEndReached } = usePagination();

  useEffect(() => {
    fetchProducts(); // fetch initial products
  }, []);

  return (
    <ScreenWrapper bg={"white"}>
      <StatusBar style="dark" />
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.logoText}>Eco Trade</Text>
          <View style={styles.icons}>
            <Pressable onPress={() => router.push("cart")}>
              <Icon name={"cart"} size={hp(3.2)} strokeWidth={2} color={theme.colors.text} />
            </Pressable>
            <Pressable>
              <Icon name={"heart"} size={hp(3.2)} strokeWidth={2} color={theme.colors.text} />
            </Pressable>
          </View>
        </View>
        {/* Search */}
        <View style={styles.row}>
          <Search
            icon={<Icon name="search" size={26} strokeWidth={1.6} />}
            placeholder="Search products, brands..."
            onChangeText={(value) => (nameRef.current = value)}
          />

          <Icon name="filter" size={hp(3.2)} strokeWidth={2} color={theme.colors.text} />
        </View>
        {/**product list */}
        <SafeAreaView>
          <ProductList products={products} onEndReached={onEndReached} isLoading={isLoading} />
        </SafeAreaView>
      </View>
    </ScreenWrapper>
  );
};

export default homePage;

const styles = StyleSheet.create({
  container: {
    //flex: 1,
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
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 20,
  },
  item: {
    height: hp(8),
    width: wp(27),
    justifyContent: "center",
    alignItems: "center",
    borderCurve: "continuous",
    borderRadius: theme.radius.xl,
  },
  title: {
    color: theme.colors.text,
    fontSize: hp(2),
    fontWeight: theme.fonts.semibold,
  },
  separator: {
    marginLeft: 7,
  },
  containerProduct: {
    flex: 1,
    marginTop: 10,
  },
  convertImage: {
    width: "90%",
    height: 200,
    borderRadius: 20,
    marginVertical: 5,
    marginLeft: 10,
    marginTop: 15,
    resizeMode: "cover",
  },

  price: {
    fontSize: 18,
    color: "#9C9C9C",
    fontWeight: theme.fonts.regular,
  },
  content: {
    paddingLeft: 15,
  },
  likeContainer: {
    position: "absolute",
    right: 10,
    top: 20,
    backgroundColor: "white",
    justifyContent: "center",
    height: 34,
    width: 34,
    alignItems: "center",
    borderRadius: 17,
  },
});
