import { Link } from "expo-router";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

const HomeScreen = () => {
  const style = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#fff",
      alignItems: "center",
      justifyContent: "center",
    },
  });
  return (
    <View style={style.container}>
      <Text>Home</Text>
      <Link href="/signUp">Sign Up</Link>
    </View>
  );
};

export default HomeScreen;
