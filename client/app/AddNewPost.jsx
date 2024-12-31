import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { hp, wp } from "../helpers/common";
import { theme } from "../constants/theme";
import Button from "../components/Button";
import Input from "../components/Input";
import { getValueFor } from "../utils/secureStore";
import useAuthSubmit from "../hooks/useAuthSubmit";
import BackButton from "../components/BackButton";
import { useRouter } from "expo-router";
import Icon from "../assets/icons";
import PopupSuccess from "../components/UI/PopUpSuccess";
import useUploadMultipleImages from "../hooks/useUploadMultipleImages";
import ImagePreview from "../components/UI/ImagePreview";
import useUploadVideo from "../hooks/useUploadVideo";

const AddNewPost = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [descriptionImages, setDescriptionImages] = useState([]);
  const [isPopupVisible, setIsPopupVisible] = useState(false); // Thêm trạng thái cho PopupSuccess
  const { images, pickImage, takePhoto, removeImage, uploadImages } = useUploadMultipleImages();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  // const { video, pickVideo, uploadVideo, setVideo } = useUploadVideo();
  const router = useRouter();

  const { onSubmit } = useAuthSubmit(`${process.env.EXPO_PUBLIC_API_URL}/posts`);

  const handleImageUpload = async () => {
    try {
      console.log("Starting image upload...");
      const uploadedImages = await uploadImages();
      console.log("Image upload response:", uploadedImages);

      if (!uploadedImages || !Array.isArray(uploadedImages) || uploadedImages.length === 0) {
        throw new Error("Image upload failed - no valid images returned");
      }

      return uploadedImages;
    } catch (error) {
      console.error("Error during image upload:", error);
      return [];
    }
  };

  // const hanldeUploadVideo = async () => {
  //   try {
  //     console.log("Starting image upload...");
  //     const uploadedImages = await uploadImages();
  //     console.log("Image upload response:", uploadedImages);

  //     if (!uploadedImages || !Array.isArray(uploadedImages) || uploadedImages.length === 0) {
  //       throw new Error("Image upload failed - no valid images returned");
  //     }

  //     return uploadedImages;
  //   } catch (error) {
  //     console.error("Error during image upload:", error);
  //     return [];
  //   }
  // };

  //add
  const handleAddNewPost = async () => {
    const userId = await getValueFor("userId");
    console.log("User ID:", userId);

    try {
      setLoading(true);
      const uploadedImages = await handleImageUpload();
      if (!uploadedImages || uploadedImages.length === 0) {
        throw new Error("No valid images uploaded.");
      }
      const formData = {
        title: title,
        description_content: description,
        description_imgs: uploadedImages,
        author_id: userId,
      };

      console.log("Form Data:", formData);

      const response = await onSubmit({
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${await getValueFor("accessToken")}`, // Assuming you have authentication
        },
        body: formData,
      });

      console.log("API Response:", response);

      // Handle success, maybe navigate back
      if (response && response.data && response.data._id) {
        // Check if the response is valid and contains an _id
        // Alert.alert("Success", "Campaign created successfully!");
        // router.back();
        setIsPopupVisible(true);
        setTimeout(() => {
          setIsPopupVisible(false);
          router.push("/Post");
        }, 2000);
        setLoading(false);
      } else {
        Alert.alert("Error", response?.message || "Failed to create post.");
      }
    } catch (error) {
      setLoading(false);
      console.error("Error creating post:", error);
      Alert.alert("Error", error.message);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.container}>
          <View style={styles.header}>
            <BackButton onPress={() => router.replace("/Post")} />
            <Text style={styles.title}>Add New post</Text>
          </View>

          {/* Title Input */}
          <Input
            label="title"
            placeholder="Enter Post title"
            value={title}
            returnKeyType="done"
            onChangeText={setTitle}
            containerStyles={styles.inputContainer} // Apply container styles
            inputContainerStyle={styles.inputInnerContainer} // Apply inner container styles
            inputStyle={styles.input} // Apply input styles
          />
          {/* Description Input */}
          <Input
            label="Description content..."
            placeholder="Enter description"
            value={description}
            onChangeText={setDescription}
            returnKeyType="done"
            multiline
            containerStyles={styles.inputContainer}
            inputContainerStyle={[styles.inputInnerContainer, styles.multilineInputContainer]} // Combine inner and multiline container styles
            inputStyle={[styles.input, styles.multilineInput]} // Combine input and multiline input styles
          />
          {/* Description Images Upload */}
          <TouchableOpacity onPress={pickImage} style={styles.uploadBox}>
            <Text style={styles.uploadText}>POST 1 TO 6 PHOTOS</Text>
          </TouchableOpacity>
          <ImagePreview images={images} onRemove={removeImage} />
          {errors.images && <Text style={styles.errorText}>{errors.images}</Text>}
          {/* Description video Upload */}
          {/* <View style={styles.uploadContainer}>
            <Text style={styles.label}>Upload a video</Text>
            <TouchableOpacity
              onPress={() => pickVideo((uri) => setVideo(uri))} // Thêm hàm setVideo
              style={styles.uploadButton}
            >
              <Icon name="image" size={24} color="gray" />
            </TouchableOpacity>
          </View>
          <ImagePreview images={video} onRemove={() => setVideo(null)} /> */}
          <Button
            title="Create new post"
            onPress={handleAddNewPost}
            loading={loading}
            buttonStyle={styles.createButton}
          />
        </View>
      </ScrollView>
      <PopupSuccess visible={isPopupVisible} onClose={() => setIsPopupVisible(false)} />
    </KeyboardAvoidingView>
  );
};

// Add styles for AddNewPost
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: wp(4),
    paddingTop: hp(8),
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: "center",
  },
  uploadBox: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  uploadText: {
    fontSize: 16,
    color: "#666",
  },
  errorBorder: {
    borderColor: "red",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginBottom: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: hp(2),
  },
  title: {
    fontSize: hp(2.8),
    fontWeight: theme.fonts.bold,
    color: theme.colors.text,
    marginBottom: hp(2),
    textAlign: "center",
    marginLeft: wp(5),
  },
  previewImage: {
    width: 200,
    height: 200,
    resizeMode: "contain",
    marginVertical: 10,
    alignSelf: "center",
  },
  uploadContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: hp(2),
    borderWidth: 1,
    borderColor: theme.colors.gray,
    borderRadius: theme.radius.md,
    padding: wp(3),
    height: hp(6),
    backgroundColor: "white",
  },
  uploadButton: {
    padding: 10,
    marginLeft: 10,
  },
  createButton: {
    marginTop: hp(2),
    backgroundColor: theme.colors.primary,
    width: "100%",
    alignSelf: "center",
  },
  imageGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    marginVertical: 10,
  },
  gridImage: {
    width: (wp(100) - wp(4) * 2 - 10 * 3) / 3,
    height: 100,
    margin: 5,
    borderRadius: 10,
  },
  selectedItemsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 10,
  },
  selectedItem: {
    backgroundColor: "#e0e0e0",
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginRight: 5,
    marginBottom: 5,
  },
  selectedItemText: {
    fontSize: 14,
  },
  inputContainer: {
    marginBottom: hp(2),
  },
  inputInnerContainer: {
    borderWidth: 1,
    borderColor: theme.colors.gray,
    borderRadius: theme.radius.md,
    padding: wp(3),
    backgroundColor: "white",
    height: hp(6),
    flexDirection: "row",
    alignItems: "center",
  },
  multilineInputContainer: {
    height: hp(15),
  },
  input: {
    flex: 1,
  },
  multilineInput: {
    textAlignVertical: "top",
  },
  locationInputContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  locationInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: theme.colors.gray,
    borderRadius: theme.radius.md,
    padding: wp(3),
    backgroundColor: "white",
    height: hp(6),
  },
  addButton: {
    backgroundColor: theme.colors.primary,
    padding: 10,
    borderRadius: 5,
    marginLeft: 10,
  },
  addButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default AddNewPost;
