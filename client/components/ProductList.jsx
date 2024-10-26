import React from "react";
import { FlatList, StyleSheet, View } from "react-native";
import Product from "../components/Product";
import Loading from "./Loading";

const ProductList = ({ products, onEndReached, isLoading }) => {
  return (
    <FlatList
      data={products}
      renderItem={({ item }) => (
        <View style={styles.itemContainer}>
          <Product product={item} />
        </View>
      )}
      showsVerticalScrollIndicator={false} // Hide the vertical scroll bar
      keyExtractor={(product) => product._id.toString()}
      numColumns={2} // Display items in 2 columns
      columnWrapperStyle={styles.row} // Style for the row
      onEndReached={onEndReached} // Load more data when scrolled to the end
      onEndReachedThreshold={5} // Adjust this threshold to load more data earlier or later
      ListFooterComponent={isLoading ? <Loading /> : null} // Show loading indicator at the bottom
    />
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    flex: 1,
    margin: 5,
  },
  row: {
    flex: 1,
    justifyContent: "space-between",
  },
});

export default ProductList;
