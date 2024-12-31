import React, { useEffect, useState } from "react";
import { View, FlatList, Text, StyleSheet, Alert } from "react-native";
import useProductStore from "../../store/useProductStore";
import ProductEditForm from "../../components/ProductEditForm";
import Button from "../../components/Button";
import ScreenWrapper from "../../components/ScreenWrapper";
import { useRoute } from "@react-navigation/native";
import Header from "../../components/Header";
import { getValueFor } from "../../utils/secureStore";
import useSecureStore from "../../store/useSecureStore";
import { useRouter } from "expo-router";

const ShopScreen = () => {
  const router = useRouter();
  const route = useRoute();
  const { ownerId } = route.params; // Selected owner ID
  const { products, fetchProductsByOwner, updateProduct, deleteProduct, error, loading } =
    useProductStore();
  const [editingProduct, setEditingProduct] = useState(null);

  // Fetch the logged-in user ID from storage
  const { userId } = useSecureStore();

  useEffect(() => {
    if (userId) {
      fetchProductsByOwner(userId);
    }
  }, [userId]);

  // Fetch products owned by the selected owner or logged-in user
  useEffect(() => {
    if (ownerId || userId) {
      console.log("Fetching products for ownerId:", ownerId, "userId:", userId);
      fetchProductsByOwner(ownerId || userId);
    }
  }, [ownerId, userId]);

  const handleUpdateProduct = (updatedProduct) => {
    updateProduct(editingProduct._id, updatedProduct);
    setEditingProduct(null);
  };

  const handleDeleteProduct = (productId) => {
    Alert.alert("Delete Product", "Are you sure you want to delete this product?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => deleteProduct(productId),
      },
    ]);
  };

  // Filter products to display only those owned by the selected owner
  const filteredProducts = products.filter((product) => String(product.owner) === String(ownerId));

  return (
    <ScreenWrapper>
      <Header title="Shop" showBackButton backButtonPress={() => router.back()} />
      <View style={styles.container}>
        {loading && <Text style={styles.loadingText}>Loading products...</Text>}
        {error && <Text style={styles.errorText}>Error: {error}</Text>}

        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => item._id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={styles.productCard}>
              <Text style={styles.productName}>{item.name}</Text>
              <Text style={styles.productPrice}>Price: {item.price} đ</Text>

              {userId === item.owner && (
                <View style={styles.buttonContainer}>
                  <Button title="Edit" onPress={() => setEditingProduct(item)} />
                  <Button title="Delete" onPress={() => handleDeleteProduct(item._id)} />
                </View>
              )}
            </View>
          )}
        />

        {editingProduct && (
          <ProductEditForm
            product={editingProduct}
            onSave={handleUpdateProduct}
            onCancel={() => setEditingProduct(null)}
          />
        )}
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  loadingText: {
    textAlign: "center",
    fontSize: 18,
    color: "#888",
    marginBottom: 20,
  },
  errorText: {
    textAlign: "center",
    fontSize: 18,
    color: "#e55b5b",
    marginBottom: 20,
  },
  productCard: {
    marginBottom: 16,
    padding: 16,
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  productName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  productPrice: {
    fontSize: 16,
    color: "#555",
    marginBottom: 8,
  },
  buttonContainer: {
    justifyContent: "space-between",
    marginTop: 12,
  },
});

export default ShopScreen;
