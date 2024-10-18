import React from 'react';
import { FlatList, View, StyleSheet } from 'react-native';
import ProductCard from '../../components/ProductCard';

const ProductList = ({ products, isLiked, setIsLiked }) => {
  return (
    <FlatList
      numColumns={2}
      data={products}
      renderItem={({ item }) => (
        <ProductCard item={item} isLiked={isLiked} setIsLiked={setIsLiked} />
      )}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 300 }}
    />
  );
};

export default ProductList;