import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome"; // Import FontAwesome icons
import { useRouter } from "expo-router"; // Import useRouter
import { theme } from "../../constants/theme";
import { hp } from "../../helpers/common";

const OtherFeature = () => {
  const router = useRouter(); // Khởi tạo router

  const handlePress = (feature) => {
    Alert.alert("Feature Clicked", `You clicked: ${feature}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>More Feature</Text>

      <View style={styles.row}>
        <TouchableOpacity style={styles.button} onPress={() => router.push("/Screens/userProfile")}>
          <FontAwesome name="user" size={24} style={styles.icon} />
          <Text style={styles.buttonText}>Personal Info</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/Screens/myProductScreens")}
        >
          <FontAwesome name="shopping-cart" size={24} style={styles.icon} />
          <Text style={styles.buttonText}>My product</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.row}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/Screens/JoinedCampaigns")}
        >
          <FontAwesome name="pencil" size={hp(2)} style={styles.icon} />
          <Text style={styles.buttonText}>Joined Campaigns</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => router.push("PrepareOrder")}>
          <FontAwesome name="pencil" size={hp(2)} style={styles.icon} />
          <Text style={styles.buttonText}>Process sell order</Text>
        </TouchableOpacity>
      </View>

      {/* "Change Password" */}
      <View style={styles.row}>
        <TouchableOpacity style={styles.button} onPress={() => router.push("ChangePassword")}>
          <FontAwesome name="lock" size={24} style={styles.icon} />
          <Text style={styles.buttonText}>Change Password</Text>
        </TouchableOpacity>

        {/* Thêm một TouchableOpacity */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/Screens/myOrderScreen")}
        >
          <FontAwesome name="list" size={hp(2)} style={styles.icon} />
          <Text style={styles.buttonText}>Order</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.row}>
        <TouchableOpacity style={styles.button} onPress={() => router.push("Screens/myPostScreen")}>
          <FontAwesome name="gift" size={hp(2)} style={styles.icon} />
          <Text style={styles.buttonText}>My Post</Text>
        </TouchableOpacity>
        {/* <TouchableOpacity style={styles.button} onPress={() => router.push("DonateRecycleDetail")}> */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => console.log("Donate Recycle Detail")}
        >
          <FontAwesome name="share" size={hp(2)} style={styles.icon} />
          <Text style={styles.buttonText}>Donate Recycle Detail</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: hp(2),
    fontWeight: "bold",
    marginBottom: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  button: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#f0f0f0",
    padding: 16,
    marginHorizontal: 8,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  icon: {
    marginRight: 8,
    color: theme.colors.primary,
  },
  buttonText: {
    fontSize: 12,
  },
});

export default OtherFeature;
