import React, { forwardRef, useEffect } from "react";
import { FlatList, StyleSheet, View, Text, TouchableOpacity } from "react-native";
import Product from "../components/Product";
import Loading from "./Loading";
import { useRouter } from "expo-router";

const ProductList = forwardRef(({ products, onEndReached, isLoading, onScroll }, ref) => {
  const router = useRouter();
  // Validate and filter products
  const validProducts = products.filter((product) => product && product._id);
  const filteredProducts = validProducts; // Apply additional filters if needed

  // console.log("Filtered products for FlatList:", filteredProducts);
  const uniqueProducts = Array.from(new Set(filteredProducts.map((product) => product._id))).map(
    (id) => filteredProducts.find((product) => product._id === id)
  );

  return (
    <>
      {uniqueProducts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No products to display</Text>
        </View>
      ) : (
        <FlatList
          ref={ref}
          data={uniqueProducts}
          renderItem={({ item }) => (
            <View style={styles.itemContainer}>
              <TouchableOpacity
                onPress={() => router.push(`/productDetails?productId=${item._id}`)}
              >
                <Product product={item} />
              </TouchableOpacity>
            </View>
          )}
          keyExtractor={(product) => product._id.toString()}
          numColumns={2}
          columnWrapperStyle={styles.row}
          onEndReached={onEndReached}
          onEndReachedThreshold={5}
          onScroll={onScroll}
          contentContainerStyle={{ paddingBottom: 100 }}
          ListFooterComponent={isLoading ? <Loading /> : null}
        />
      )}
    </>
  );
});

const styles = StyleSheet.create({
  itemContainer: {
    flex: 1,
    margin: 5,
  },
  row: {
    flex: 1,
    justifyContent: "space-between",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  emptyText: {
    fontSize: 18,
    color: "#888",
  },
});

export default ProductList;
