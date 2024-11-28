import React, { forwardRef } from "react";
import { FlatList, StyleSheet, View, Text } from "react-native";
import Product from "../components/Product";
import Loading from "./Loading";

const ProductList = forwardRef(({ products, onEndReached, isLoading, onScroll }, ref) => {
  // Validate and filter products
  const validProducts = products.filter((product) => product && product._id);
  const filteredProducts = validProducts; // Apply additional filters if needed

  // console.log("Filtered products for FlatList:", filteredProducts);

  return (
    <>
      {filteredProducts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No products to display</Text>
        </View>
      ) : (
        <FlatList
          ref={ref}
          data={filteredProducts}
          renderItem={({ item }) => (
            <View style={styles.itemContainer}>
              <Product product={item} />
            </View>
          )}
          keyExtractor={(product) => product._id.toString()}
          numColumns={2}
          columnWrapperStyle={styles.row}
          onEndReached={onEndReached}
          onEndReachedThreshold={5}
          onScroll={onScroll}
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
