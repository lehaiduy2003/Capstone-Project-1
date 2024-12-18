import { StyleSheet, Text, View, StatusBar, Pressable } from "react-native";
import React from "react";
import ScreenWrapper from "../components/ScreenWrapper";
import { deleteValueFor } from "../utils/secureStore"; // Import deleteValueFor
import { useRouter } from "expo-router";

const account = () => {
    const router = useRouter(); // Khởi tạo router ở đây
    const handleSignOut = async () => {
        try {
            await deleteValueFor("accessToken");
            await deleteValueFor("refreshToken");
            await deleteValueFor("user_id");
            console.log("Signed out successfully!");
            router.push("SignIn");
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };

    return (
        <ScreenWrapper bg={"white"}>
            <StatusBar style="dark" />
            <View style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.title}>My Account</Text>
                </View>
                {/* btn Sign Out */}
                <Pressable onPress={handleSignOut}>
                    <Text>Sign Out</Text>
                </Pressable>
            </View>
        </ScreenWrapper>
    );
};

export default account;

const styles = StyleSheet.create({
    header: {
        flexDirection: "row",
        justifyContent: "center",
        paddingVertical: 10,
    },
    title: {
        fontSize: 25,
        fontWeight: "bold",
    },
});
