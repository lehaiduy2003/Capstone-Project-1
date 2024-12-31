import {
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
  ActivityIndicator,
  Image,
} from "react-native";
import React, { useState, useRef } from "react";
import ScreenWrapper from "../../components/ScreenWrapper";
import Header from "../../components/Header";
import Search from "../../components/Search";
import { hp, wp } from "../../helpers/common";
import { theme } from "../../constants/theme";
import { SafeAreaView } from "react-native-safe-area-context";
import usePagination from "../../hooks/usePagination";
import { Feather } from "@expo/vector-icons";
import AddProductModal from "../../components/Dashboard/AddNewProductModal";

const TABS = {
  ALL: "All",
  NEWEST: "Newest",
  OLDEST: "Oldest",
};

const PostManagement = () => {
  const { products, isLoading, error, onEndReached } = usePagination();
  const [activeTab, setActiveTab] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const nameRef = useRef("");
  const [showAddModal, setShowAddModal] = useState(false);

  const filterProducts = () => {
    let filtered = [...products];

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by price category
    switch (activeTab) {
      case "NEWEST":
        return filtered.filter((product) => product.price < 20000);
      case "OLDEST":
        return filtered.filter((product) => product.price >= 20000 && product.price <= 40000);
      case "HIGH_PRICE":
        return filtered.filter((product) => product.price > 40000);
      default:
        return filtered;
    }
  };

  const handleEditProduct = (product) => {
    // Thêm logic chỉnh sửa sản phẩm
    console.log("Edit product:", product);
  };

  const handleDeleteProduct = (productId) => {
    // Thêm logic xóa sản phẩm
    console.log("Delete product:", productId);
  };

  const handleAddProduct = () => {
    setShowAddModal(true);
  };

  const handleAddSuccess = (newProduct) => {
    // Cập nhật lại danh sách sản phẩm
    setShowAddModal(false);
  };

  const renderProduct = ({ item }) => (
    <View style={styles.productCard}>
      <View style={styles.productImageContainer}>
        <Image source={{ uri: item.img }} style={styles.productImage} />
        <View style={styles.actionButtons}>
          <Pressable style={styles.iconButton} onPress={() => handleEditProduct(item)}>
            <Feather name="edit" size={hp(2.5)} color={theme.colors.text} />
          </Pressable>
          <Pressable style={styles.iconButton} onPress={() => handleDeleteProduct(item._id)}>
            <Feather name="trash-2" size={hp(2.5)} color={theme.colors.danger} />
          </Pressable>
        </View>
      </View>
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2}>
          {item.name}
        </Text>
        <Text style={styles.productPrice}>{item.price.toLocaleString("vi-VN")} đ</Text>
        <View style={styles.statusContainer}>
          <View
            style={[
              styles.statusIndicator,
              {
                backgroundColor:
                  item.status === "active" ? theme.colors.success : theme.colors.gray,
              },
            ]}
          />
          <Text style={styles.statusText}>
            {item.status === "active" ? "For sale" : "Stop selling"}
          </Text>
        </View>
      </View>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Search
          icon={<Feather name="search" size={26} />}
          placeholder="Search for products..."
          onChangeText={(value) => {
            nameRef.current = value;
            setSearchQuery(value);
          }}
        />
        <Pressable style={styles.addButton} onPress={handleAddProduct}>
          <Feather name="plus" size={hp(2.5)} color="white" />
          <Text style={styles.addButtonText}>Add new</Text>
        </Pressable>
      </View>

      {/* Category Tabs */}
      <View style={styles.tabsContainer}>
        {Object.entries(TABS).map(([key, label]) => (
          <Pressable
            key={key}
            style={[styles.tab, activeTab === key && styles.activeTab]}
            onPress={() => setActiveTab(key)}
          >
            <Text style={[styles.tabText, activeTab === key && styles.activeTabText]}>{label}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );

  return (
    //   <ScreenWrapper>
    //     <Header title="Product Management" showBackButton />
    <SafeAreaView style={styles.container}>
      {renderHeader()}
      <FlatList
        data={filterProducts()}
        renderItem={renderProduct}
        keyExtractor={(item) => item._id}
        numColumns={2}
        contentContainerStyle={styles.productList}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.1}
        ListFooterComponent={
          isLoading ? <ActivityIndicator size="large" color={theme.colors.primary} /> : null
        }
      />
      <AddProductModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={handleAddSuccess}
      />
    </SafeAreaView>
    //   </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    paddingHorizontal: wp(4),
    paddingTop: hp(2),
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp(2),
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.primary,
    paddingHorizontal: wp(3),
    paddingVertical: hp(1),
    borderRadius: theme.radius.lg,
    gap: wp(1),
  },
  addButtonText: {
    color: "white",
    fontSize: hp(1.8),
    fontWeight: theme.fonts.semibold,
  },
  tabsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: hp(2),
    paddingBottom: hp(1),
  },
  tab: {
    paddingVertical: hp(1),
    paddingHorizontal: wp(4),
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.gray100,
  },
  activeTab: {
    backgroundColor: theme.colors.primary,
  },
  tabText: {
    fontSize: hp(1.8),
    color: theme.colors.text,
    fontWeight: theme.fonts.medium,
  },
  activeTabText: {
    color: "white",
  },
  productList: {
    padding: wp(4),
  },
  productCard: {
    flex: 1,
    margin: wp(1),
    backgroundColor: "white",
    borderRadius: theme.radius.lg,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  productImageContainer: {
    position: "relative",
  },
  productImage: {
    width: "100%",
    height: hp(20),
    borderTopLeftRadius: theme.radius.lg,
    borderTopRightRadius: theme.radius.lg,
  },
  actionButtons: {
    position: "absolute",
    top: hp(1),
    right: wp(2),
    flexDirection: "row",
    gap: wp(2),
  },
  iconButton: {
    backgroundColor: "white",
    padding: wp(2),
    borderRadius: theme.radius.full,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  productInfo: {
    padding: wp(3),
  },
  productName: {
    fontSize: hp(2),
    fontWeight: theme.fonts.semibold,
    color: theme.colors.text,
    marginBottom: hp(1),
  },
  productPrice: {
    fontSize: hp(1.8),
    color: theme.colors.primary,
    fontWeight: theme.fonts.bold,
    marginBottom: hp(1),
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp(1),
  },
  statusIndicator: {
    width: wp(2),
    height: wp(2),
    borderRadius: theme.radius.full,
  },
  statusText: {
    fontSize: hp(1.6),
    color: theme.colors.text,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: theme.colors.danger,
    fontSize: hp(2),
    textAlign: "center",
  },
});

export default PostManagement;
