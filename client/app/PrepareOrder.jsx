import React, { useEffect, useState } from "react";
import { Button, FlatList, Image, StyleSheet, Text, View } from "react-native";
import useSecureStore from "../store/useSecureStore";
import { useNavigation } from "@react-navigation/native";
import Header from "../components/Header";
import ScreenWrapper from "../components/ScreenWrapper";
import parsedCurrency from "../utils/currency";
import { useRouter } from "expo-router";

const PrepareOrder = () => {
  const router = useRouter();
  const { userId, accessToken } = useSecureStore();
  const navigation = useNavigation();
  const [transactions, setTransactions] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${process.env.EXPO_PUBLIC_API_URL}/transactions/users/${userId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        const data = await response.json();
        setTransactions(data.data);
        // console.log(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.transactionContainer}>
      <Image source={{ uri: item.product.img }} style={styles.image} />
      <View style={styles.detailsContainer}>
        <Text style={styles.name}>{item.product.name}</Text>
        <Text style={styles.price}>
          Price: {parsedCurrency("currency", "VND", item.product.price)}
        </Text>
        <Text style={styles.quantity}>Quantity: {item.product.quantity}</Text>
      </View>
      <Button
        title="Process"
        onPress={() => navigation.navigate("Screens/ProcessScreen", { transaction: item })}
      />
    </View>
  );

  return (
    <ScreenWrapper>
      <Header
        title={"Prepare Orders"}
        showBackButton={true}
        backButtonPress={() => router.replace("account")}
      ></Header>
      <FlatList
        data={transactions}
        renderItem={renderItem}
        keyExtractor={(item) => item._id.toString()}
      />
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  transactionContainer: {
    flexDirection: "row",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  image: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  detailsContainer: {
    flex: 1,
    justifyContent: "center",
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
  },
  price: {
    fontSize: 14,
  },
  quantity: {
    fontSize: 14,
  },
});

export default PrepareOrder;
