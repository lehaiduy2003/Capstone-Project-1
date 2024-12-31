import { ActivityIndicator, Alert, Button, Modal, StyleSheet, Text, View } from "react-native";
import React from "react";
import ScreenWrapper from "../components/ScreenWrapper";
import Header from "../components/Header";
import { useState, useEffect } from "react";
import { FlatList, Image, TouchableOpacity } from "react-native";
import { wp } from "../helpers/common";
import Icon from "../assets/icons";
import { theme } from "../constants/theme";

import * as Linking from "expo-linking";

import { initPaymentSheet, presentPaymentSheet, StripeProvider } from "@stripe/stripe-react-native";
import { Screen } from "react-native-screens";
import useCartStore from "../store/useCartStore";
import { useNavigation, useRouter } from "expo-router";
import { useRoute } from "@react-navigation/native";
import { RadioButton } from "react-native-paper";
import useSecureStore from "../store/useSecureStore";
import parsedCurrency from "../utils/currency";
import Loading from "../components/Loading";

const CheckOut = () => {
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const navigation = useNavigation(); // navigate to another screen with payload
  const route = useRoute(); // get params from previous screen
  const router = useRouter(); // redirect to another screen after payment
  const { cartItems, totalPrice, clearCart } = useCartStore();
  const [intent, setIntent] = useState("");
  const [user, setUser] = useState({});
  const { userId, accessToken } = useSecureStore();
  const [defaultAddress, setDefaultAddress] = useState(route.params?.defaultAddress || null);
  const products = cartItems.map((item) => ({
    _id: item._id,
    quantity: item.cartQuantity,
    name: item.name,
    price: item.price,
    img: item.img,
    owner: item.owner,
  }));
  // console.log(products);

  useEffect(() => {
    if (route.params?.defaultAddress) {
      setDefaultAddress(route.params.defaultAddress);
    }
  }, [route.params?.defaultAddress]);

  const checkout = async () => {
    // Call the API to create a checkout session
    // This is where you would typically call your backend server to create a checkout session
    // The backend server would then call the Stripe API to create a session
    // The client would then redirect to the Stripe hosted checkout page
    // The client would then be redirected back to the success_url or cancel_url specified in the session
    const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/stripe/checkout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        products: products,
        id: userId,
      }),
    });
    if (!response.ok) {
      Alert.alert("Error", "An error occurred. Please try again.");
      router.replace("(tabs)/HomePage");
    }
    const data = await response.json();
    // console.log(data);
    setIntent(data.clientSecret);
    // console.log(intent);

    return data.clientSecret;
  };

  const getUser = async () => {
    const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/users/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    if (!data.phone) {
      Alert.alert(
        "Missing Information",
        "Please update your phone number in the profile section. Do you want to go to the profile section?",
        [
          {
            text: "Cancel",
            onPress: () => {
              navigation.goBack();
            },
            style: "cancel",
          },
          {
            text: "Confirm",
            onPress: () => {
              navigation.navigate("Screens/userProfile");
            },
            style: "default",
          },
        ],
        { cancelable: true }
      );
    }
    setUser(data);
    if (defaultAddress === null) {
      setDefaultAddress(data.address[0]);
    }
    return data;
  };

  const initializePaymentSheet = async () => {
    await getUser();
    const paymentIntent = await checkout();
    // const fetchData = await Promise.all([getUser(), checkout()]);
    // const paymentIntent = fetchData[0];

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
      setLoading(true);
      try {
        const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/transactions`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            user_id: userId,
            products: products,
            metadata: {
              payment_intent: intent,
              shipping_address: defaultAddress,
              payment_method: "card",
              payment_status: "paid",
              user_name: user.name,
              user_phone: user.phone,
            },
          }),
        });
        const data = await response.json();
        // console.log(data);
        await clearCart();
        router.replace({
          pathname: "Screens/myOrderScreen",
          state: { from: "CheckOut" },
        });
      } catch (error) {
        Alert.alert("Error", "An error occurred. Please try again.");
        throw new Error(error);
      } finally {
        setLoading(false);
      }
    }
  };

  const cashPayment = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/transactions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          user_id: userId,
          products: products,
          metadata: {
            shipping_address: defaultAddress,
            payment_method: "cash",
            payment_status: "unpaid",
            user_name: user.name,
            user_phone: user.phone,
          },
        }),
      });
      const data = await response.json();
      // console.log(data);
      await clearCart();
      Alert.alert("Success", "Your order is confirmed!");
      router.replace("Screens/myOrderScreen");
    } catch (error) {
      Alert.alert("Error", "An error occurred. Please try again.");
      throw new Error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      await initializePaymentSheet();
    };
    fetchProducts();
  }, []);

  const shippingCost = 42700;
  const serviceCost = totalPrice * 0.01; // 1% of total price
  const grandTotal = totalPrice + shippingCost + serviceCost;

  // console.log(user);

  const handleOrder = async () => {
    if (paymentMethod === "card") {
      await openPaymentSheet();
    } else {
      await cashPayment();
    }
  };

  return (
    <StripeProvider publishableKey={process.env.EXPO_PUBLIC_STRIPE_PK}>
      <ScreenWrapper bg={"#f0f3f4"}>
        <View style={styles.container}>
          {loading ? (
            <Modal
              transparent={true}
              animationType="fade"
              visible={loading}
              onRequestClose={() => {}}
            >
              <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                  <ActivityIndicator size="large" color="green" />
                  <Text>Loading...</Text>
                </View>
              </View>
            </Modal>
          ) : (
            <>
              {/*Header*/}
              <Header
                title={"Check out"}
                showBackButton
                backButtonPress={() => router.back()}
              ></Header>
              {/* Shipping Address */}
              <Text style={styles.sectionTitle}>Shipping address</Text>
              <View style={styles.section}>
                <View style={styles.addressContainer}>
                  <TouchableOpacity style={styles.addressEdit}>
                    <Text>{user.name}</Text>
                    <Text>{user.phone}</Text>
                    <Text>{defaultAddress}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() =>
                      navigation.push("Screens/AddressScreen", {
                        address: user.address,
                        defaultAddress: defaultAddress,
                      })
                    }
                  >
                    <Icon name="arrowLeft" size={26} strokeWidth={1.6} />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Cart Items */}
              <Text style={styles.sectionTitle}>Products</Text>
              <FlatList
                style={styles.section}
                data={products}
                keyExtractor={(item) => item._id.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => navigation.replace("productDetails", { productId: item._id })}
                  >
                    <View style={styles.itemContainer}>
                      <Image source={{ uri: item.img }} style={styles.itemImage} />
                      <View style={styles.itemDetails}>
                        <Text>{item.name}</Text>
                        <Text> {parsedCurrency("currency", "VND", item.price)}</Text>
                      </View>
                      <View style={styles.itemQuantity}>
                        <Text>{item.quantity}</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                )}
              />

              {/* Payment Method */}
              <Text style={styles.sectionTitle}>Payment method</Text>
              <View style={styles.radioContainer}>
                <View style={styles.radioOption}>
                  <TouchableOpacity
                    style={styles.radioOption}
                    onPress={() => setPaymentMethod("card")}
                  >
                    <RadioButton
                      value="card"
                      status={paymentMethod === "card" ? "checked" : "unchecked"}
                      onPress={() => setPaymentMethod("card")}
                    />
                    <Text>Card</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.radioOption}>
                  <TouchableOpacity
                    style={styles.radioOption}
                    onPress={() => setPaymentMethod("cash")}
                  >
                    <RadioButton
                      value="cash"
                      status={paymentMethod === "cash" ? "checked" : "unchecked"}
                      onPress={() => setPaymentMethod("cash")}
                    />
                    <Text>Cash</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Order Summary */}
              <Text style={styles.sectionTitle}>Cost details</Text>
              <View style={styles.section}>
                <View style={styles.summaryRow}>
                  <Text>Total cost</Text>
                  <Text>{parsedCurrency("currency", "VND", totalPrice)}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text>shipping cost</Text>
                  <Text>{parsedCurrency("currency", "VND", shippingCost)}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text>Service cost</Text>
                  <Text>{parsedCurrency("currency", "VND", serviceCost)}</Text>
                </View>
              </View>

              {/* Checkout Button */}
              <View style={styles.footer}>
                <Text style={styles.footerTotalText}>
                  Total payment: {parsedCurrency("currency", "VND", grandTotal)}
                </Text>
                <Screen>
                  <Button variant="primary" title="Order" onPress={handleOrder} />
                </Screen>
              </View>
            </>
          )}
        </View>
      </ScreenWrapper>
    </StripeProvider>
  );
};

export default CheckOut;

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
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  section: {
    marginVertical: 10,
    backgroundColor: "white",
    borderRadius: 5,
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
  radioContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    backgroundColor: "white",
  },
  radioOption: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
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
    borderRadius: 5,
    width: "100%",
    backgroundColor: "white",
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
