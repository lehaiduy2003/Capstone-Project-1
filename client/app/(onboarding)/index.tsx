import { Link } from "expo-router";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

const HomeScreen = () => {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#fff",
      alignItems: "center",
      justifyContent: "center",
    },
  });
  return (
    <View style={styles.container}>
      <Text>Home</Text>
      <Link href="/signUp">Sign Up</Link>
    </View>
  );
};

export default HomeScreen;
