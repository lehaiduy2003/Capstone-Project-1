import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
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

const DonateRecycleDetail = () => {
  const router = useRouter();
  const [content, setContent] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [pickUpAddress, setPickUpAddress] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null); // For image
  const [selectedVideo, setSelectedVideo] = useState(null); // For video

  const { onSubmit } = useAuthSubmit(
    `${process.env.EXPO_PUBLIC_API_URL}/donations` // Replace with your API endpoint
  );

  const handleIncreaseQuantity = () => setQuantity(quantity + 1);
  const handleDecreaseQuantity = () =>
    quantity > 1 && setQuantity(quantity - 1);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const pickVideo = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedVideo(result.assets[0].uri);
    }
  };

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
          user_id: userId,
          campaign_id: "your_campaign_id", // Thay bằng campaign_id thích hợp
          donated: {
            name: content,
            content: content,
            weight: quantity, //  hoặc một giá trị weight khác nếu cần
            quantity: quantity,
            // img: "", // Thêm trường img nếu cần
          },
          from: pickUpAddress, // Thêm trường from
          to: deliveryAddress, // Thêm trường to
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to submit donation");
      }

      Alert.alert("Success", "Donation submitted successfully!");
      // Chuyển hướng hoặc thực hiện các hành động khác sau khi submit thành công
      router.back();
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
    <ScreenWrapper bg={"white"}>
      <StatusBar style="dark" />
      {/* <View>
        <BackButton router={router} />
        <Header title="Donate Details" />
      </View> */}
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <BackButton router={router} />
          <Text style={styles.logoText}>Donate Details</Text>
          <View style={{ width: 24 }} />
        </View>
        {/* ... (Icon buttons for photo/video) */}
        <View style={styles.iconContainers}>
          <TouchableOpacity style={styles.iconButton} onPress={pickImage}>
            <Icon
              name="camera"
              size={hp(3.2)}
              strokeWidth={2}
              color={theme.colors.text}
            />
            <Text style={styles.iconText}>Add photo</Text>
            {selectedImage && (
              <Image source={{ uri: selectedImage }} style={styles.thumbnail} />
            )}
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={pickVideo}>
            <Icon
              name="video"
              size={hp(3.2)}
              strokeWidth={2}
              color={theme.colors.text}
            />
            <Text style={styles.iconText}>Add video</Text>
            {selectedVideo && (
              <Image source={{ uri: selectedVideo }} style={styles.thumbnail} />
            )}
            {/* Hiển thị video đã chọn (nếu có) */}
          </TouchableOpacity>
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
        <Text style={styles.label}>From</Text>
        <Input
          placeholder="Pick up address..."
          value={pickUpAddress}
          onChangeText={setPickUpAddress}
        />
        <Text style={styles.label}>To</Text>
        <Input
          placeholder="Delivery address..."
          value={deliveryAddress}
          onChangeText={setDeliveryAddress}
        />
        <Button title="Submit" onPress={handleSubmit} loading={isLoading} />
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: wp(4),
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
