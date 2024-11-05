import { useEffect, useState } from "react";
import { View, StatusBar, StyleSheet, Text, FlatList } from "react-native";
import ScreenWrapper from "../../components/ScreenWrapper";
import HeadScreen from "../../components/HomePage/HeadScreen";
import SearchBar from "../../components/HomePage/SearchBar";
import { hp, wp } from "../../helpers/common";
import ProductCard from "../../components/ProductCard";
import Category from "../../components/RecyclePage/Category";
import { theme } from "../../constants/theme";
import { getValueFor } from "../../utils/secureStore";
import usePagination from "../../hooks/usePagination";

const RecycleCampaign = () => {
  const [isLiked, setIsLiked] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const { data, isLoading, fetchProducts, onEndReached } = usePagination();

  useEffect(() => {
    fetchProducts(); // fetch initial
  }, []);

  const categoriesData = [
    {
      id: 1,
      name: "Coca Cola",
      image: require("../../assets/images/recycle/coca2.jpg"),
    },
    {
      id: 2,
      name: "Paper Recycle",
      image: require("../../assets/images/recycle/chai.jpg"),
    },
    {
      id: 3,
      name: "coca",
      image: require("../../assets/images/recycle/coca.jpg"),
    },
    {
      id: 4,
      name: "bottle",
      image: require("../../assets/images/recycle/coca2.jpg"),
    },
  ];

  const handleSelectCategory = (category) => {
    setSelectedCategory(category);
  };

  const renderItem = ({ item }) => (
    <ProductCard item={item} isLiked={isLiked} setIsLiked={setIsLiked} />
  );

  useEffect(() => {
    const fetchProducts = async () => {
      const accessToken = await getValueFor("accessToken");
      const response = await fetch(process.env.EXPO_PUBLIC_API_URL, {
        method: "GET",
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();
      setProducts(data.products);
    };
    fetchProducts();
  }, []);

  return (
    <ScreenWrapper bg={"white"}>
      <StatusBar style="dark" />
      <View style={styles.container}>
        <View style={styles.header}>
          {/* lấy từ component/HomePage/ */}
          <HeadScreen />
          <SearchBar />
        </View>
        {/* FlatList sẽ đảm nhận cả Category và Product List */}
        <FlatList
          numColumns={2}
          data={categoriesData}
          renderItem={renderItem} // Render danh sách sản phẩm
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: 300,
          }}
          // Đặt phần Category làm tiêu đề của FlatList
          ListHeaderComponent={
            <View>
              {/* Category */}
              <View style={styles.categoryPart}>
                <Category
                  categories={categoriesData}
                  onSelectCategory={handleSelectCategory}
                />
                {selectedCategory && (
                  <Text style={styles.selectedCategoryText}>
                    Selected: {selectedCategory.name}
                  </Text>
                )}
              </View>
              <View style={{ flexDirection: "row" }}>
                <ProductCard />
                <ProductCard />
              </View>
            </View>
          }
        />
      </View>
    </ScreenWrapper>
  );
};

export default RecycleCampaign;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: wp(4),
  },
  header: {},
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 20,
  },
  categoryPart: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 0,
  },
  title: {
    fontSize: hp(2),
    fontWeight: "bold",
    marginBottom: 20,
  },
  selectedCategoryText: {
    fontSize: 20,
    color: theme.colors.gray,
  },
  productListPart: {},
});
