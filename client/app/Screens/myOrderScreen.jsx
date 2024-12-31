import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import ScreenWrapper from "../../components/ScreenWrapper";
import { theme } from "../../constants/theme";
import useSecureStore from "../../store/useSecureStore";
import parsedCurrency from "../../utils/currency";
import { useNavigation, useRoute } from "@react-navigation/native";
import Header from "../../components/Header";
import { useRouter } from "expo-router";

const MyOrdersScreen = () => {
  const navigation = useNavigation();
  const router = useRouter();
  const route = useRoute();
  const { userId, accessToken } = useSecureStore(); // Use useSecureStore to get userId and accessToken
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("pending");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // // Function to load user_id and access token (e.g., after successful login)
    // const loadAuthInfo = async () => {
    //   setUserId(await getValueFor("user_id"));
    //   setAccessToken(await getValueFor("accessToken"));
    // };

    // loadAuthInfo(); // Call function when component mounts
    if (route.params?.fromScreen === "CheckOut") {
      // Clear the history and set the homepage screen
      navigation.reset({
        index: 0,
        routes: [{ name: "(tabs)/HomePage" }],
      });
    }

    const fetchOrders = async () => {
      setLoading(true);
      setError(null); // Reset error state before fetching

      try {
        if (!userId || !accessToken) {
          // userId and accessToken from useSecureStore
          throw new Error("Not logged in.");
        }
        console.log("userId: ", userId); // Check userId

        // // Log request details
        // console.log(
        //   "Request URL:",
        //   `${process.env.EXPO_PUBLIC_API_URL}/users/${userId}/transactions`
        // );
        // console.log("Request Headers:", {
        //   Authorization: `Bearer ${accessToken}`,
        // });

        const response = await fetch(
          `${process.env.EXPO_PUBLIC_API_URL}/users/${userId}/transactions`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        const data = await response.json();
        setOrders(data.data);
      } catch (err) {
        setError(err); // Set error state when an error occurs
        console.error("Error fetching order data:", err);
      } finally {
        setLoading(false);
      }
    };

    if (userId && accessToken) {
      // Only fetch when userId and accessToken are available
      fetchOrders();
    }
  }, [userId, accessToken]); // userId and accessToken from useSecureStore

  const filteredOrders =
    activeTab === "Ongoing"
      ? orders.filter((order) => order.transaction_status === "pending")
      : orders.filter((order) => order.transaction_status === "completed");

  const OrderItem = ({ item }) => {
    // item is a product object
    if (!item || !item.product) {
      // Only check item and item.product
      return <Text>No products in this order.</Text>;
    }

    const { img, name, price } = item.product;

    return (
      <View style={styles.orderItemContainer}>
        <Image source={{ uri: img }} style={styles.itemImage} />
        <View style={styles.orderInfo}>
          <Text style={styles.itemName}>{name}</Text>
          <Text style={styles.itemPrice}>{parsedCurrency("currency", "VND", price)}</Text>
        </View>
        <TouchableOpacity style={styles.reviewButton}>
          <Text style={styles.reviewButtonText}>Leave review</Text>
        </TouchableOpacity>
      </View>
    );
  };

  if (loading) {
    return (
      <ScreenWrapper bg={"white"}>
        <StatusBar style="dark" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </ScreenWrapper>
    );
  }

  if (error) {
    return (
      <ScreenWrapper bg={"white"}>
        <StatusBar style="dark" />
        <Header title={"Check out"} showBackButton></Header>
        <View style={styles.container}>
          <Text style={styles.title}>My Orders</Text>
          <Text style={styles.errorText}>Error: {error.message}</Text>
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper bg={"white"}>
      <StatusBar style="dark" />
      <Header
        title={"Check out"}
        showBackButton
        backButtonPress={() => router.replace("account")}
      ></Header>
      <View style={styles.container}>
        <Text style={styles.title}>My Orders</Text>
        <View style={styles.toggleButton}>
          <TouchableOpacity
            onPress={() => setActiveTab("Ongoing")}
            style={[styles.tab, activeTab === "Ongoing" && styles.activeTab]}
          >
            <Text style={[styles.tabText, activeTab === "Ongoing" && styles.activeTabText]}>
              Ongoing
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveTab("Completed")}
            style={[styles.tab, activeTab === "Completed" && styles.activeTab]}
          >
            <Text style={[styles.tabText, activeTab === "Completed" && styles.activeTabText]}>
              Completed
            </Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={filteredOrders}
          keyExtractor={(item) => item._id.toString()}
          renderItem={({ item }) => <OrderItem item={item} />}
          style={styles.flatList}
          ListEmptyComponent={<Text>No orders found.</Text>}
        />
      </View>
    </ScreenWrapper>
  );
};

export default MyOrdersScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  toggleButton: {
    width: 371,
    height: 54,
    padding: 8,
    backgroundColor: "#E6E6E6",
    borderRadius: 10,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    marginBottom: 20,
  },
  tab: {
    height: 38,
    paddingVertical: 9,
    paddingHorizontal: 53,
    backgroundColor: "#E6E6E6",
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  activeTab: {
    backgroundColor: "white",
  },
  tabText: {
    textAlign: "center",
    color: "#999999",
    fontSize: 14,
    fontFamily: "General Sans",
    fontWeight: "500",
    lineHeight: 19.6,
  },
  activeTabText: {
    color: "#1A1A1A",
  },
  flatList: {
    flex: 1,
  },
  orderItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 10,
  },
  orderInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  itemPrice: {
    fontSize: 16,
    color: theme.colors.primary,
  },
  reviewButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: theme.colors.primary,
    borderRadius: 5,
  },
  reviewButtonText: {
    color: "#fff",
    fontSize: 14,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: theme.colors.primary,
  },
  errorText: {
    marginTop: 10,
    fontSize: 16,
    color: "red",
  },
});
