import Container from "@/components/Container";
import { Link } from "expo-router";
import React from "react";
import { Text } from "react-native";

const HomeScreen = () => {
  const check = process.env.EXPO_PUBLIC_API_URL;
  console.log(check);

  return (
    <Container
      flex={1}
      bgColor="#fff"
      alignItems="center"
      justifyContent="center"
    >
      <Text>Home</Text>
      <Link href="/signUp">Sign Up</Link>
    </Container>
  );
};

export default HomeScreen;
