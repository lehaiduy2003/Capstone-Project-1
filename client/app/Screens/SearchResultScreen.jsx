import React, { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  StatusBar,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  ActivityIndicator,
  FlatList,
  Image,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import usePagination from "../../hooks/usePagination";
import ScreenWrapper from "../../components/ScreenWrapper";
import Icon from "../../assets/icons";
import Search from "../../components/Search";
import { hp, wp } from "../../helpers/common";
import { theme } from "../../constants/theme";
import ProductList from "../../components/ProductList";
import { useNavigation } from "@react-navigation/native";
import BackButton from "../../components/BackButton";

const postItem = ({ item }, router) => (
  <TouchableOpacity
    key={item._id}
    style={styles.itemContainer}
    onPress={() => router.push(`/PostDetail?id=${item._id}`)}
  >
    <Image source={{ uri: item.description_imgs[0] }} style={styles.itemImage} />
    <View style={styles.itemDetails}>
      <Text style={styles.itemName}>{item.title}</Text>
      <Text style={styles.itemDescription}>{item.description_content}</Text>
    </View>
  </TouchableOpacity>
);

const SearchResultScreen = () => {
  const router = useRouter();
  const navigator = useNavigation();
  const { searchQuery, searchType, type } = useLocalSearchParams();
  const [searchResultQuery, setSearchResultQuery] = useState(searchQuery);
  const [sortOrder, setSortOrder] = useState("asc");

  console.log("search:", searchType, searchQuery, type);

  const { products, isLoading, onEndReached, sortOption, orderOption, hasNextPage, fetchNextPage } =
    usePagination(searchType, true, searchResultQuery, type);
  const flatListRef = useRef(null);

  const handleScroll = (event) => {
    event.nativeEvent.contentOffset.y;
  };

  const handleSortByPriceASC = () => {
    sortOption("price");
    orderOption("asc");
  };

  const handleSortByPriceDESC = () => {
    sortOption("price");
    orderOption("desc");
  };

  const handleSortByNewest = () => {
    sortOption("updated_at");
    orderOption("desc");
  };

  const handleSortByPrice = () => {
    if (sortOrder === "asc") {
      setSortOrder("desc");
      handleSortByPriceDESC();
    } else {
      setSortOrder("asc");
      handleSortByPriceASC();
    }
  };

  // Fetch and display search results based on the query
  // For demonstration, we'll just display the query
  return (
    <ScreenWrapper bg={"white"}>
      <StatusBar style="dark" />
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <BackButton onPress={() => navigator.goBack()} />
          <Text style={styles.title}>Result</Text>
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
            onChangeText={(value) => setSearchResultQuery(value)}
            searchType={searchType}
            value={searchQuery}
          />
          <View style={styles.filterOption}>
            <TouchableOpacity style={styles.filterButton} onPress={handleSortByNewest}>
              <Text style={styles.filterButtonText}>Newest</Text>
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity style={styles.filterButton} onPress={handleSortByPriceASC}>
              <Text style={styles.filterButtonText}>best-selling</Text>
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity style={styles.filterButton} onPress={handleSortByPrice}>
              <Text style={styles.filterButtonText}>Price {sortOrder === "asc" ? "▲" : "▼"}</Text>
            </TouchableOpacity>
          </View>
        </View>
        {/**product list */}
        {isLoading && (
          <Modal
            transparent={true}
            animationType="fade"
            visible={isLoading}
            onRequestClose={() => {}}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <ActivityIndicator size="large" color="green" />
                <Text>Loading...</Text>
              </View>
            </View>
          </Modal>
        )}
        {searchType === "products" ? (
          <SafeAreaView>
            <ProductList
              products={products}
              onEndReached={onEndReached}
              isLoading={isLoading}
              ref={flatListRef}
              onScroll={handleScroll}
            />
          </SafeAreaView>
        ) : (
          <FlatList
            data={products}
            renderItem={(item) => postItem(item, router)}
            keyExtractor={(item) => item._id}
            onEndReached={() => {
              if (hasNextPage) {
                fetchNextPage();
              }
            }}
          />
        )}
      </View>
    </ScreenWrapper>
  );
};

export default SearchResultScreen;

const styles = StyleSheet.create({
  container: {
    //flex: 1,
    paddingHorizontal: wp(4),
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  filterOption: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    backgroundColor: "#f8f8f8",
    borderRadius: 5,
    marginVertical: 10,
  },
  filterButton: {
    width: 100, // Set the desired width
    height: 40, // Set the desired height
    padding: 10,
    backgroundColor: "transparent",
    borderRadius: 5,
    justifyContent: "center", // Center the text vertically
    alignItems: "center", // Center the text horizontally
  },
  filterButtonText: {
    color: "green",
    fontWeight: "bold",
  },
  divider: {
    width: 1,
    height: "100%",
    backgroundColor: "#ccc",
  },
  itemImage: {
    width: 80,
    height: 80,
    marginRight: 16,
    borderRadius: 8,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  itemDescription: {
    fontSize: 14,
    color: "gray",
  },
  itemContainer: {
    flexDirection: "row",
    padding: 10,
    backgroundColor: "white",
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
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
    alignItems: "center",
    justifyContent: "space-between",
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
