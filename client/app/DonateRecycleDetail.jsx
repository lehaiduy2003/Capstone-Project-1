import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker"; // Import ImagePicker
import ScreenWrapper from "../components/ScreenWrapper";
import { hp, wp } from "../helpers/common";
import { theme } from "../constants/theme";
import Icon from "../assets/icons";
import Button from "../components/Button";
import Header from "../components/Header";
import QuantitySelector from "../components/QuantitySelector";
import Input from "../components/Input"; // Import Input component
import useAuthSubmit from "../hooks/useAuthSubmit"; // Import useAuthSubmit hook
import { getValueFor } from "../utils/secureStore";
import BackButton from "../components/BackButton"; // Import BackButton
import { useRoute } from "@react-navigation/native";

const DonateRecycleDetail = () => {
  const router = useRouter();
  const route = useRoute();
  const { id } = route.params; // Extract the id from route parameters
  const [content, setContent] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [weight, setWeight] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [campaign, setCampaign] = useState(null);

  // console.log("id", id);

  const { onSubmit } = useAuthSubmit(
    `${process.env.EXPO_PUBLIC_API_URL}/donations/qrcode` // Replace with your API endpoint
  );

  const handleIncreaseQuantity = () => setQuantity(quantity + 1);
  const handleDecreaseQuantity = () => quantity > 1 && setQuantity(quantity - 1);

  useEffect(() => {
    const fetchCampaign = async () => {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/campaigns/${id}`);
      const data = await response.json();
      setCampaign(data);
    };
    fetchCampaign();
  }, []);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const accessToken = await getValueFor("accessToken");
      const userId = await getValueFor("userId");

      const response = await onSubmit({
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: {
          userId: userId,
          campaignId: id, // Thay bằng campaign_id thích hợp
          content: content,
          weight: weight, //  hoặc một giá trị weight khác nếu cần
          quantity: quantity,
        },
      });

      // if (!response.ok) {
      //   // const errorData = await response.json();
      //   throw new Error("Failed to submit donation");
      // }
      // const data = await response.json();
      // Chuyển hướng hoặc thực hiện các hành động khác sau khi submit thành công
      router.replace(`Screens/qrCodeScreen?qrCode=${response.qrCode}`);
    } catch (error) {
      console.error("Error submitting donation:", error);
      Alert.alert("Error", error.message);
    } finally {
      setIsLoading(false);
    }

    // Add image/video to the request body (if selected)
    if (selectedImage) {
      body.img = selectedImage; // Or however your API expects the image data
    }
    if (selectedVideo) {
      body.video = selectedVideo; //  Or however your API expects the video data
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScreenWrapper bg={"white"}>
        <StatusBar style="dark" />
        {/* <View>
        <BackButton router={router} />
        <Header title="Donate Details" />
      </View> */}
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
              <BackButton onPress={() => router.back()} />
              <Text style={styles.logoText}>Donate Details</Text>
              <View style={{ width: 24 }} />
            </View>
            <View style={styles.card}>
              <Text style={styles.label}>Campaign</Text>
              <Text style={styles.title}>{campaign?.name}</Text>
              <Image source={{ uri: campaign?.img }} style={styles.image} />
              <Text style={styles.description}>{campaign?.description_content}</Text>
            </View>
            <Text style={styles.label}>Content</Text>
            <Input
              placeholder="Recycled Goods..."
              value={content}
              onChangeText={setContent}
              // other props for Input component if needed
            />
            <Text style={styles.label}>Quantity</Text>
            <QuantitySelector
              quantity={quantity}
              onIncrease={handleIncreaseQuantity}
              onDecrease={handleDecreaseQuantity}
              maxQuantity={100}
            />
            <Text style={styles.label}>Weight (Kg)</Text>
            <Input
              placeholder="Enter weight of the package..."
              value={weight}
              keyboardType="numeric"
              returnKeyType="done"
              onChangeText={setWeight}
            />
            <Button
              buttonStyle={styles.button}
              title="Submit"
              onPress={handleSubmit}
              loading={isLoading}
            />
          </View>
        </ScrollView>
      </ScreenWrapper>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: wp(4),
  },
  button: {
    marginVertical: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: "center",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#333",
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: "#666",
  },
  iconContainers: {
    flexDirection: "row",
    justifyContent: "space-around", // Canh đều các icon
    marginBottom: 20,
  },
  iconButton: {
    alignItems: "center",
  },
  iconText: {
    marginTop: 5,
    color: theme.colors.text,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    color: theme.colors.text,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    backgroundColor: "#f8f8f8",
  },
  thumbnail: {
    width: 50,
    height: 50,
    marginTop: 5,
    resizeMode: "cover",
  },
  logoText: {
    fontSize: hp(3.6),
    fontWeight: theme.fonts.bold,
    color: theme.colors.text,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 50,
    marginHorizontal: wp(4),
    paddingTop: hp(2),
  },
});

export default DonateRecycleDetail;
