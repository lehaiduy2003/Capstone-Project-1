import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity } from "react-native";
import React, { useEffect } from "react";
import ScreenWrapper from "../../components/ScreenWrapper";
import { useRouter } from "expo-router";
import { theme } from "../../constants/theme";
import { hp } from "../../helpers/common";
import { useState } from "react";
import Loading from "../../components/Loading";
import Header from "../../components/Header";
import Button from "../../components/Button";

const CartItem = ({ item, onIncrease, onDecrease }) => {
  const formattedPrice = new Intl.NumberFormat("vi-VI", {
    style: "currency",
    currency: "VND",
  }).format(item.price * 1000);
  return (
    <View style={styles.cartItem}>
      <Image source={{ uri: item.image }} style={styles.itemImage} />
      <View style={styles.itemDetails}>
        <Text style={styles.itemName}>{item.title}</Text>
        <Text style={styles.itemPrice}>{formattedPrice}</Text>
      </View>
      <View style={styles.quantityContainer}>
        <TouchableOpacity onPress={onDecrease}>
          <Text style={styles.quantityButton}>-</Text>
        </TouchableOpacity>
        <Text style={styles.quantityText}>{item.quantity}</Text>
        <TouchableOpacity onPress={onIncrease}>
          <Text style={styles.quantityButton}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
const Cart = () => {
  const router = useRouter();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch data from the API
    fetch("https://fakestoreapi.com/products")
      .then((response) => response.json())
      .then((data) => {
        // Add quantity field to each product for state management
        const updatedData = data.map((item) => ({
          ...item,
          quantity: 1, // Start with a default quantity of 1 for each item
        }));
        setCartItems(updatedData);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        setLoading(false);
      });
  }, []);

  const increaseQuantity = (id) => {
    const updatedCart = cartItems.map((item) => (item.id === id ? { ...item, quantity: item.quantity + 1 } : item));
    setCartItems(updatedCart);
  };

  const decreaseQuantity = (id) => {
    const updatedCart = cartItems.map((item) =>
      item.id === id && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
    );
    setCartItems(updatedCart);
  };

  const calculateTotalPrice = () => {
    // const formattedPrice = new Intl.NumberFormat('vi-VI', {
    //     style: 'currency',
    //     currency: 'VND'
    // }).format(item.price * 1000);
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <ScreenWrapper>
      {/*Header*/}
      <Header title={"My cart"} showBackButton />

      {/*Cart items*/}
      <View style={styles.container}>
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
      </View>

      {/*Footer*/}
      <View style={styles.footer}>
        <Text style={styles.totalPrice}>Total price: {calculateTotalPrice().toFixed(2)} đ</Text>
        <Button title="Checkout" onPress={() => router.push("checkOut")} />
      </View>
    </ScreenWrapper>
  );
};

export default Cart;

const styles = StyleSheet.create({
  title: {
    fontSize: hp(3),
    fontWeight: theme.fonts.semibold,
    color: theme.colors.textDark,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  cartList: {
    paddingBottom: 300,
  },
  cartItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
    elevation: 2,
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 10,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  itemPrice: {
    fontSize: 14,
    color: "#888",
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  quantityButton: {
    fontSize: 18,
    fontWeight: "bold",
    paddingHorizontal: 10,
  },
  quantityText: {
    fontSize: 16,
    marginHorizontal: 8,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFF",
    padding: 16,
    borderTopWidth: 1,
    borderColor: "#DDD",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 65,
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: "bold",
  },
  checkoutButton: {
    backgroundColor: "#000",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  checkoutText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
