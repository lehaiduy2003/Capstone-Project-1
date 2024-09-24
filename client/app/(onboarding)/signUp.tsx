import InputBox from "@/components/InputBox";
import Oauth from "@/components/ui/Oauth";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

const SignUp = () => {
  const [name, setName] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [email, setEmail] = React.useState("");

  const handleNameChange = (value: string) => {
    setName(value);
  };
  const handlePasswordChange = (value: string) => {
    setPassword(value);
  };
  const handleEmailChange = (value: string) => {
    setEmail(value);
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Let's</Text>

      <Text
        style={{
          fontSize: 30,
          fontWeight: "bold",
          paddingLeft: 20,
          color: "#00C26F",
        }}
      >
        Get Started
      </Text>

      <Text style={styles.subtitle}>
        Please fill the details to create an account
      </Text>

      <InputBox
        placeholder="Enter your name"
        onChangeText={handleNameChange}
        value={name}
      />
      <InputBox
        placeholder="Enter your email"
        onChangeText={handleEmailChange}
        value={email}
      />
      <InputBox
        placeholder="Enter your password"
        onChangeText={handlePasswordChange}
        value={password}
      />
      <Oauth />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "flex-start",
    flexDirection: "column",
    justifyContent: "flex-start",
    paddingTop: 30,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    paddingLeft: 20,
  },
  subtitle: {
    fontSize: 14,
    fontStyle: "normal",
    paddingTop: 30,
    paddingLeft: 20,
  },
});

export default SignUp;
