import { Alert, Button, StyleSheet, Text, View } from "react-native";
import React from "react";
import ScreenWrapper from "../components/ScreenWrapper";
import Header from "../components/Header";
import { useState, useEffect } from "react";
import { FlatList, Image, TouchableOpacity } from "react-native";
import { wp } from "../helpers/common";
import Loading from "../components/Loading";
import Icon from "../assets/icons";
import { theme } from "../constants/theme";

import * as Linking from "expo-linking";

import { initPaymentSheet, presentPaymentSheet, StripeProvider } from "@stripe/stripe-react-native";
import { getValueFor } from "../utils/secureStore";
import { Screen } from "react-native-screens";
import useCartStore from "../store/useCartStore";

const checkOut = () => {
  const [loading, setLoading] = useState(true);

  const { cartItems, totalPrice, clearCart } = useCartStore();
  const products = cartItems.map((item) => ({
    _id: item._id,
    quantity: item.cartQuantity,
    name: item.name,
    price: item.price,
    img: item.img,
    owner: item.owner,
  }));
  // console.log(products);

  const [intent, setIntent] = useState("");
  const checkout = async () => {
    const token = await getValueFor("accessToken");
    const userId = await getValueFor("userId");
    // Call the API to create a checkout session
    // This is where you would typically call your backend server to create a checkout session
    // The backend server would then call the Stripe API to create a session
    // The client would then redirect to the Stripe hosted checkout page
    // The client would then be redirected back to the success_url or cancel_url specified in the session
    const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/stripe/checkout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        products: products,
        id: userId,
      }),
    });
    const data = await response.json();
    // console.log(data);
    setIntent(data.clientSecret);
    // console.log(intent);

    return data.clientSecret;
  };

  const initializePaymentSheet = async () => {
    const paymentIntent = await checkout();

    const { error } = await initPaymentSheet({
      merchantDisplayName: "Example, Inc.",
      paymentIntentClientSecret: paymentIntent,
      returnURL: Linking.createURL("HomePage"),
    });
    if (error) {
      console.log("Payment sheet initialization error:", error);
      Alert.alert(`Error initializing payment sheet: ${error.message}`);
      return;
    }
    setLoading(false);
  };

  const openPaymentSheet = async () => {
    const { error } = await presentPaymentSheet();

    if (error) {
      console.log(`Error code: ${error.code}`, error.message);
    } else {
      Alert.alert("Success", "Your order is confirmed!");
      const token = await getValueFor("accessToken");
      const userId = await getValueFor("userId");
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/transactions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          user_id: userId,
          products: products,
          metadata: {
            payment_intent: intent,
            payment_method: "cash",
            shipping_address: "Cam Le, Da Nang",
            payment_method: "card",
            payment_status: "paid",
          },
        }),
      });
      const data = await response.json();
      // console.log(data);
      await clearCart();
    }

    setLoading(false);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      await initializePaymentSheet();
    };

    fetchProducts();
  }, []);

  const shippingCost = 42700;
  const grandTotal = totalPrice + shippingCost;

  if (loading) {
    return <Loading />;
  }

  return (
    <StripeProvider publishableKey={process.env.EXPO_PUBLIC_STRIPE_PK}>
      <ScreenWrapper>
        <View style={styles.container}>
          {/*Header*/}
          <Header title={"Check out"} showBackButton></Header>
          {/* Shipping Address */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Shipping address</Text>
            <View style={styles.addressContainer}>
              <TouchableOpacity style={styles.addressEdit}>
                <Text>Home</Text>
                <Text>No 46, Awolowo Road....</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => alert("pop edit address")}>
                <Icon name="edit" size={26} strokeWidth={1.6} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Cart Items */}
          <FlatList
            data={products}
            keyExtractor={(item) => item._id.toString()}
            renderItem={({ item }) => (
              <View style={styles.itemContainer}>
                <Image source={{ uri: item.img }} style={styles.itemImage} />
                <View style={styles.itemDetails}>
                  <Text>{item.name}</Text>
                  <Text> {item.price.toLocaleString()}</Text>
                </View>
                <View style={styles.itemQuantity}>
                  <Text>{item.quantity}</Text>
                </View>
              </View>
            )}
          />

          {/* Payment Method */}
          <TouchableOpacity style={styles.section} onPress={() => alert("pop payment method")}>
            <Text style={styles.sectionTitle}>Payment method</Text>
            <Text>Cash</Text>
          </TouchableOpacity>

          {/* Order Summary */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Payment details</Text>
            <View style={styles.summaryRow}>
              <Text>Total cost</Text>
              <Text>{totalPrice.toLocaleString()}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text>Total shipping cost</Text>
              <Text>{shippingCost.toLocaleString()}</Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.grandTotalText}>Total payment</Text>
              <Text style={styles.grandTotalText}>{grandTotal.toLocaleString()} VNĐ</Text>
            </View>
          </View>

          {/* Checkout Button */}
          <View style={styles.footer}>
            <Text style={styles.footerTotalText}>Total payment: {grandTotal.toLocaleString()}</Text>
            <Screen>
              <Button variant="primary" title="Order" onPress={openPaymentSheet} />
            </Screen>
          </View>
        </View>
      </ScreenWrapper>
    </StripeProvider>
  );
};

export default checkOut;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: wp(2),
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  section: {
    marginVertical: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  addressContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  addressEdit: {
    flexDirection: "column",
  },
  editIcon: {
    width: 20,
    height: 20,
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
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
  itemQuantity: {
    paddingHorizontal: 10,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 5,
  },
  grandTotalText: {
    fontWeight: "bold",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: "#ccc",
  },
  footerTotalText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  orderButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  orderButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
