import { StyleSheet, Text, View } from "react-native";
import React from "react";
import ScreenWrapper from "../components/ScreenWrapper";
import Header from "../components/Header";
import { useState, useEffect } from "react";
import { FlatList, ActivityIndicator, Image, TouchableOpacity } from "react-native";
import { wp } from "../helpers/common";
import Loading from "../components/Loading";
import Icon from "../assets/icons";
import { theme } from "../constants/theme";

const checkOut = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch data from fakestoreapi.com
    const fetchProducts = async () => {
      try {
        const response = await fetch("https://fakestoreapi.com/products");
        const data = await response.json();
        // Assuming we only want to display the first few products in the cart
        setCartItems(data.slice(0, 2)); // Just showing the first 2 items for example
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const calculateTotalPrice = () => {
    return cartItems.reduce((acc, item) => acc + item.price * 1, 0); // Assuming quantity of 1 for simplicity
  };

  const shippingCost = 42700;
  const grandTotal = calculateTotalPrice() + shippingCost;

  if (loading) {
    return <Loading />;
  }

  return (
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
          data={cartItems}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.itemContainer}>
              <Image source={{ uri: item.image }} style={styles.itemImage} />
              <View style={styles.itemDetails}>
                <Text>{item.title}</Text>
                <Text> {item.price.toLocaleString()}</Text>
              </View>
              <View style={styles.itemQuantity}>
                <Text>1</Text>
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
            <Text>{calculateTotalPrice().toLocaleString()}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text>Total shipping cost</Text>
            <Text>{shippingCost.toLocaleString()}</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.grandTotalText}>Total payment</Text>
            <Text style={styles.grandTotalText}>{grandTotal.toLocaleString()}</Text>
          </View>
        </View>

        {/* Checkout Button */}
        <View style={styles.footer}>
          <Text style={styles.footerTotalText}>Total payment: {grandTotal.toLocaleString()}</Text>
          <TouchableOpacity style={styles.orderButton} onPress={() => alert("Order placed!")}>
            <Text style={styles.orderButtonText}>Order</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScreenWrapper>
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
