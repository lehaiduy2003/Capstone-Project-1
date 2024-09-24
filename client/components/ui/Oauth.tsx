import { Link } from "expo-router";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import ThirtPartySignIn from "../ThirtPartySignIn";

const Oauth = () => {
  const handleSignUp = () => {
    console.log("Sign Up with Google");
  };
  return (
    <>
      <View style={styles.thirdParty}>
        <Text style={styles.subtitle}>Or using other method</Text>
        {/*Google*/}
        <ThirtPartySignIn
          iconName="google"
          type="antdesign"
          title="Sign Up with Google"
          onPress={handleSignUp}
        />
      </View>
      <View style={styles.thirdParty}>
        <Text>Already have an account?</Text>
        <Link href="/signIn" style={{ color: "#00C26F", fontWeight: "bold" }}>
          Sign In
        </Link>
      </View>
    </>
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
  subtitle: {
    fontSize: 14,
    fontStyle: "normal",
    paddingTop: 30,
    paddingLeft: 20,
  },
  thirdParty: {
    flex: 1,
    flexDirection: "column",
    alignSelf: "center",
    alignItems: "center",
  },
});
export default Oauth;
