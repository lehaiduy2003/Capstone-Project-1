import { StyleSheet, View, FlatList, Text } from "react-native";
import React, { useEffect, useState } from "react";
import ScreenWrapper from "../../components/ScreenWrapper";
import { useRouter } from "expo-router";
import useCartStore from "../../store/useCartStore";
import Header from "../../components/Header";
import CartFooter from "../../components/Cart/CartFooter";
import LottieView from "lottie-react-native";
import CartItem from "../../components/Cart/CartItem";

const Cart = () => {
  const router = useRouter();
  const { totalPrice, removeProduct, updateQuantity } = useCartStore();
  const cartItems = useCartStore((state) => state.cartItems);
  // Fetch product data for each cart item and filter out duplicates based on `_id`
  const fetchProductData = async () => {
    const products = await Promise.all(
      cartItems.map(async (item) => {
        const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/products/${item._id}`);
        const data = await response.json();
        // console.log("Product Data:", data);
        data.cartQuantity = item.quantity;
        return data;
      })
    );
    // Filter out duplicates based on `_id` if any are present
    const uniqueProducts = Array.from(new Set(products.map((item) => item._id))).map((id) =>
      products.find((item) => item._id === id)
    );

    return uniqueProducts;
  };

  const [uniqueCartItems, setUniqueCartItems] = useState([]);

  useEffect(() => {
    const loadProductData = async () => {
      const uniqueItems = await fetchProductData();
      setUniqueCartItems(uniqueItems);
    };

    loadProductData();
  }, [cartItems]);

  const increaseQuantity = (productId) => {
    updateQuantity(productId, 1);
  };

  const decreaseQuantity = (productId) => {
    const product = uniqueCartItems.find((item) => item._id === productId);
    if (product && product.quantity > 1) {
      updateQuantity(productId, -1);
    } else {
      removeProduct(productId);
    }
  };

  const handleCheckout = () => {
    router.push({
      pathname: "checkOut",
      params: {
        totalPrice,
        cartItems: JSON.stringify(uniqueCartItems),
      },
    });
  };

  return (
    <ScreenWrapper>
      <Header title={"My Cart"} showBackButton />
      <View style={styles.container}>
        {uniqueCartItems.length === 0 ? (
          // Display Empty Cart UI
          <View style={styles.emptyCartContainer}>
            {/* <Image
              source={{ uri: "https://example.com/empty-cart-icon.png" }} // replace with a local image if you prefer
              style={styles.emptyCartIcon}
            /> */}
            <LottieView
              style={styles.emptyCartIcon}
              source={require("../../assets/animation/animation_cart_empty.json")}
              autoPlay
              loop
            />
            <Text style={styles.emptyCartText}>Your Cart Is Empty!</Text>
            <Text style={styles.emptyCartSubText}>When you add products, they’ll appear here.</Text>
          </View>
        ) : (
          // Display Cart Items List
          <FlatList
            data={uniqueCartItems}
            keyExtractor={(item) => item._id.toString()}
            renderItem={({ item }) => (
              <CartItem
                item={item}
                onIncrease={() => increaseQuantity(item._id)}
                onDecrease={() => decreaseQuantity(item._id)}
              />
            )}
            contentContainerStyle={styles.cartList}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
      {cartItems.length > 0 && <CartFooter totalPrice={totalPrice} onCheckout={handleCheckout} />}
    </ScreenWrapper>
  );
};

export default Cart;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 200,
  },
  emptyCartContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyCartIcon: {
    width: 150,
    height: 150,
    marginBottom: 16,
  },
  emptyCartText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  emptyCartSubText: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
  },
  cartList: {
    paddingBottom: 300,
  },
});
