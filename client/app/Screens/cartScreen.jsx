import { StyleSheet, View, FlatList, Text } from "react-native";
import React from "react";
import ScreenWrapper from "../../components/ScreenWrapper";
import { useRouter } from "expo-router";
import useCartStore from "../../store/useCartStore";
import Header from "../../components/Header";
import CartFooter from "../../components/Cart/CartFooter";
import LottieView from "lottie-react-native";
import CartItem from "../../components/Cart/CartItem";

const Cart = () => {
  const router = useRouter();
  const { totalPrice, removeProduct, increaseProductQuantity, decreaseProductQuantity } =
    useCartStore();
  const cartItems = useCartStore((state) => state.cartItems);
  // Filter out duplicates based on `_id` if any are present
  const uniqueCartItems = Array.from(new Set(cartItems.map((item) => item._id))).map((id) =>
    cartItems.find((item) => item._id === id)
  );

  // const increaseQuantity = (productId) => {
  //   const product = uniqueCartItems.find((item) => item.id === productId);
  //   if (product) {
  //     addProduct({ ...product, quantity: product.quantity + 1 });
  //   }
  // };

  // const increaseProductQuantity = useCartStore((state) => state.increaseProductQuantity);

  // const decreaseQuantity = (productId) => {
  //   const product = uniqueCartItems.find((item) => item.id === productId);
  //   if (product && product.quantity > 1) {
  //     addProduct({ ...product, quantity: product.quantity - 1 });
  //   } else {
  //     removeProduct(productId);
  //   }
  // };

  const increaseQuantity = (productId) => {
    increaseProductQuantity(productId);
  };

  const decreaseQuantity = (productId) => {
    const product = uniqueCartItems.find((item) => item._id === productId);
    if (product && product.quantity > 1) {
      decreaseProductQuantity(productId);
    } else {
      removeProduct(productId);
    }
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
