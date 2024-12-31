import { View, Text, StyleSheet, StatusBar, Pressable, FlatList } from "react-native";
import React, { useEffect, useRef } from "react";
import ScreenWrapper from "../../components/ScreenWrapper";
import { hp, wp } from "../../helpers/common";
import { theme } from "../../constants/theme";
import Icon from "../../assets/icons";
import { useRouter } from "expo-router";
import usePagination from "../../hooks/usePagination";
import ProductList from "../../components/ProductList";
import { SafeAreaView } from "react-native-safe-area-context";
import { useScrollStore } from "../../store/useScrollStore";
import Search from "../../components/Search";

const HomePage = () => {
  const router = useRouter();
  const { products, isLoading, onEndReached } = usePagination("products");
  const flatListRef = useRef(null);
  const nameRef = useRef("");
  const setScrollPosition = useScrollStore((state) => state.setScrollPosition);
  const getScrollPosition = useScrollStore((state) => state.getScrollPosition);
  useEffect(() => {
    const savedPosition = getScrollPosition("HomePage");
    if (flatListRef.current) {
      flatListRef.current.scrollToOffset({
        offset: savedPosition,
        animated: false,
      });
    }
  }, []);

  const handleScroll = (event) => {
    const currentScrollPosition = event.nativeEvent.contentOffset.y;
    setScrollPosition("HomePage", currentScrollPosition);
  };

  const handleTypePress = (type) => {
    console.log("type", type.toLowerCase());

    router.push(`Screens/SearchResultScreen?searchType=products&type=${type.toLowerCase()}`);
  };

  const productTypes = ["clothing", "furniture", "gear", "electronics", "books"];
  return (
    <ScreenWrapper bg={"white"}>
      <StatusBar style="dark" />
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.logoText}>Eco Trade</Text>
          <View style={styles.icons}>
            <Pressable onPress={() => router.push("Screens/cartScreen")}>
              <Icon name={"cart"} size={hp(3.2)} strokeWidth={2} color={theme.colors.text} />
            </Pressable>
            <Pressable>
              <Icon name={"heart"} size={hp(3.2)} strokeWidth={2} color={theme.colors.text} />
            </Pressable>
          </View>
        </View>
        {/* Search */}
        <View style={styles.searchContainer}>
          <Search
            icon={<Icon name="search" size={26} strokeWidth={1.6} />}
            placeholder="Search products, brands..."
            onChangeText={(value) => (nameRef.current = value)}
            searchType="products"
            screen={"Screens/SearchResultScreen"}
          />
          <FlatList
            data={productTypes}
            horizontal
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <Pressable onPress={() => handleTypePress(item)} style={styles.typeButton}>
                <Text style={styles.typeText}>{item}</Text>
              </Pressable>
            )}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.typeList}
          />
        </View>

        {/**product list */}
        <SafeAreaView>
          <ProductList
            products={products}
            onEndReached={onEndReached}
            isLoading={isLoading}
            ref={flatListRef}
            onScroll={handleScroll}
          />
        </SafeAreaView>
      </View>
    </ScreenWrapper>
  );
};

export default HomePage;

const styles = StyleSheet.create({
  container: {
    //flex: 1,
    paddingHorizontal: wp(4),
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
  searchContainer: {
    flexDirection: "column",
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
  typeList: {
    paddingHorizontal: hp(2),
    paddingVertical: hp(1),
  },
  typeButton: {
    marginRight: hp(1),
    padding: hp(1),
    backgroundColor: theme.colors.primary,
    borderRadius: hp(1),
  },
  typeText: {
    color: "white",
    fontSize: hp(2),
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
