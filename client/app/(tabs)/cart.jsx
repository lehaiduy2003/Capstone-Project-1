import { StyleSheet, View, FlatList, Text, Image } from "react-native";
import React from "react";
import ScreenWrapper from "../../components/ScreenWrapper";
import { useRouter } from "expo-router";
import useCartStore from "../../store/useCartStore";
import Header from "../../components/Header";
import CartItem from "../../components/CartItem";
import CartFooter from "../../components/Cart/CartFooter";
import LottieView from "lottie-react-native";

const Cart = () => {
  const router = useRouter();
  const { cartItems, totalPrice, addProduct, removeProduct } = useCartStore();

  const increaseQuantity = (productId) => {
    const product = cartItems.find((item) => item.id === productId);
    if (product) {
      addProduct({ ...product, quantity: product.quantity + 1 });
    }
  };

  const decreaseQuantity = (productId) => {
    const product = cartItems.find((item) => item.id === productId);
    if (product && product.quantity > 1) {
      addProduct({ ...product, quantity: product.quantity - 1 });
    } else {
      removeProduct(productId);
    }
  };

  return (
    <ScreenWrapper>
      <Header title={"My Cart"} showBackButton />
      <View style={styles.container}>
        {cartItems.length === 0 ? (
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
            data={cartItems}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <CartItem
                item={item}
                onIncrease={() => increaseQuantity(item.id)}
                onDecrease={() => decreaseQuantity(item.id)}
              />
            )}
            contentContainerStyle={styles.cartList}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
      {cartItems.length > 0 && (
        <CartFooter totalPrice={totalPrice} onCheckout={() => router.push("checkOut")} />
      )}
    </ScreenWrapper>
  );
};

export default Cart;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 200
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
