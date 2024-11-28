import { StyleSheet, Text, View, FlatList, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import ScreenWrapper from '../../components/ScreenWrapper';
import Header from '../../components/Header';
import LottieView from 'lottie-react-native';
import ProductEditForm from "../../components/ProductEditForm";
import Button from "../../components/Button";
import { getValueFor } from "../../utils/secureStore";
import useProductStore from "../../store/useProductStore";
import { useRouter } from 'expo-router';

const MyProductScreens = () => {
  const { products, fetchProductsByOwner, updateProduct, deleteProduct, error, loading } = useProductStore();
  const [editingProduct, setEditingProduct] = useState(null);
  const [userId, setUserId] = useState(null);
  const router = useRouter();

  // Fetch the logged-in user ID from storage
  useEffect(() => {
    const fetchUserId = async () => {
      const userIdFromStorage = await getValueFor("userId");
      setUserId(userIdFromStorage);
    };
    fetchUserId();
  }, []);

  // Fetch products owned by the logged-in user
  useEffect(() => {
    if (userId) {
      fetchProductsByOwner(userId);
    }
  }, [userId]);

  const handleUpdateProduct = (updatedProduct) => {
    updateProduct(editingProduct._id, updatedProduct);
    setEditingProduct(null);
  };

  const handleDeleteProduct = (productId) => {
    Alert.alert(
      "Delete Product",
      "Are you sure you want to delete this product?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => deleteProduct(productId),
        },
      ]
    );
  };
  const navigateToAddNewProduct = () => {
    router.push({
      pathname: `/Screens/addNewProductScreen`,
    });
  }
  // Filter products to display only those owned by the logged-in user
  const filteredProducts = products.filter((product) => String(product.owner) === String(userId));

  return (
    <ScreenWrapper>
      <Header title="My Products" showBackButton />
      <View style={styles.container}>
        {loading && <Text style={styles.loadingText}>Loading products...</Text>}
        {error && <Text style={styles.errorText}>Error: {error}</Text>}

        <View style={styles.newProductContainer} >
          <LottieView
            style={styles.newProduct}
            source={require('../../assets/animation/animation_add_new_product.json')}
            autoPlay
            loop
          />
          <Text style={{ fontSize: 16, fontWeight: 'bold' }} onPress={navigateToAddNewProduct}>Add New Product</Text>
        </View>
        <View style={styles.listProductTitle}>
          <Text style={{ fontSize: 26, fontWeight: 'bold' }}>All product</Text>
        </View>

        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => item._id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={styles.productCard}>
              <Text style={styles.productName}>{item.name}</Text>
              <Text style={styles.productPrice}>Price: {item.price} đ</Text>
              <View style={styles.buttonContainer}>
                <Button title="Edit" onPress={() => setEditingProduct(item)} />
                <Button title="Delete" onPress={() => handleDeleteProduct(item._id)} />
              </View>
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
    alignItems: 'center',
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
  newProduct: {
    width: 150,
    height: 150,
  },
  newProductContainer: {
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
    height: 200,
    width: 300,
  },
  listProductTitle: {
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
    height: 100,
    width: '100%',
    marginTop: 50,
    justifyContent: 'center',
    marginBottom: 50,
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
    width: 300,
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

export default MyProductScreens;
