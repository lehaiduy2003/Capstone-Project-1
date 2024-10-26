import { Pressable, StatusBar, StyleSheet, Text, View, Alert } from "react-native";
import React, { useEffect } from "react";
import ScreenWrapper from "../components/ScreenWrapper";
import { wp } from "../helpers/common";
import { hp } from "../helpers/common";
import { theme } from "../constants/theme";
import Button from "../components/Button";
import { useRouter } from "expo-router";
import LottieView from "lottie-react-native";
import { requestNewAccessToken } from "../utils/fetch";

const welcome = () => {
  const router = useRouter();
  useEffect(() => {
    const checkAuth = async () => {
      const token = await requestNewAccessToken();
      token !== null ? router.push("homePage") : Alert.alert("Hi", "Please login or sign up to continue");
    };
    checkAuth();
  }, []);
  return (
    <ScreenWrapper bg="white">
      <StatusBar style="dark" />
      <View style={styles.container}>
        {/* welcome animation*/}
        <LottieView
          style={styles.conWelcomeAnimation}
          source={require("../assets/animation/animation_welcome.json")}
          autoPlay
          loop
        />

        {/* title*/}
        <View style={{ gap: 20 }}>
          <Text style={styles.punchLine}>Discover Deals, Anytime, Anywhere</Text>
        </View>
        {/* footer*/}
        <View style={styles.footer}>
          <Button
            title="Getting Started"
            buttonStyle={{ marginHorizontal: wp(3) }}
            onPress={() => {
              router.push("SignUp");
            }}
          />
          <View style={styles.bottomTextContainer}>
            <Text style={styles.loginText}>Already have an account?</Text>
            <Pressable
              onPress={() => {
                router.push("SignIn");
              }}
            >
              <Text
                style={[
                  styles.loginText,
                  {
                    color: theme.colors.primaryDark,
                    fontWeight: theme.fonts.semibold,
                  },
                ]}
              >
                Sign In
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default welcome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "white",
    paddingHorizontal: wp(4),
  },
  conWelcomeAnimation: {
    height: hp(30),
    width: wp(100),
    alignItem: "center",
  },

  title: {
    color: theme.colors.text,
    fontSize: hp(4),
    textAlign: "center",
    fontWeight: theme.fonts.extraBold,
  },

  punchLine: {
    color: theme.colors.text,
    fontSize: hp(2.5),
    textAlign: "center",
    paddingHorizontal: wp(10),
    //fontWeight: theme.fonts.semibold,
  },
  footer: {
    width: "100%",
    gap: 30,
  },

  bottomTextContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
  },
  loginText: {
    textAlign: "center",
    color: theme.colors.text,
    fontSize: hp(1.6),
  },
});
