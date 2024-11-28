import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Button from "../components/Button";

const ProductItem = ({ product, onEdit }) => (
  <View style={styles.productContainer}>
    <Text style={styles.productName}>{product.name}</Text>
    <Text style={styles.productPrice}>Price: {product.price} đ</Text>
    <Button title="Edit" onPress={() => onEdit(product)} />
  </View>
);

export default ProductItem;

const styles = StyleSheet.create({
  productContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  productName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  productPrice: {
    fontSize: 16,
    color: "#888",
  },
});
