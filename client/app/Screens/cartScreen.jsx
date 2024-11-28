import { StyleSheet, View, FlatList, Text } from "react-native";
import React, { useEffect } from "react";
import ScreenWrapper from "../../components/ScreenWrapper";
import { useRouter } from "expo-router";
import Header from "../../components/Header";
import CartFooter from "../../components/Cart/CartFooter";
import LottieView from "lottie-react-native";
import CartItem from "../../components/Cart/CartItem";
import useCartStore from "../../store/useCartStore";
import { debounce } from "lodash";

const Cart = () => {
  const router = useRouter();

  const { cartItems, totalPrice, initializeCart } = useCartStore();
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeProduct = useCartStore((state) => state.removeProduct);
  console.log("cartItems", cartItems);

  useEffect(() => {
    initializeCart();
  }, []);

  const increaseQuantity = async (product) => {
    if (product.cartQuantity < product.quantity) {
      debounce(async () => {
        await updateQuantity(product._id, 1);
      }, 100)();
    }
  };

  const decreaseQuantity = async (product) => {
    if (product.cartQuantity > 1) {
      debounce(async () => {
        await updateQuantity(product._id, -1);
      }, 100)();
    } else {
      await removeProduct(product._id);
    }
  };

  const handleCheckout = () => {
    router.push("CheckOut");
  };

  return (
    <ScreenWrapper>
      <Header title={"My Cart"} showBackButton />
      <View style={styles.container}>
        {cartItems ? (
          // Display Cart Items List
          <FlatList
            data={cartItems}
            keyExtractor={(item) => item._id.toString()}
            renderItem={({ item }) => (
              <CartItem
                item={item}
                onIncrease={() => increaseQuantity(item)}
                onDecrease={() => decreaseQuantity(item)}
              />
            )}
            contentContainerStyle={styles.cartList}
            showsVerticalScrollIndicator={false}
          />
        ) : (
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
        )}
      </View>
      {cartItems && <CartFooter totalPrice={totalPrice} onCheckout={handleCheckout} />}
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
