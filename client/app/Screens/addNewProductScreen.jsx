import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Video } from "expo-av";
import { Picker } from "@react-native-picker/picker";
import useProductStore from "../../store/useProductStore";
import useSecureStore from "../../store/useSecureStore";
import useUploadMultipleImages from "../../hooks/useUploadMultipleImages";
import useUploadVideo from "../../hooks/useUploadVideo";
import ScreenWrapper from "../../components/ScreenWrapper";
import Header from "../../components/Header";
import PopupSuccess from "../../components/UI/PopUpSuccess";
import PopUpFailed from "../../components/UI/PopUpFailed";
import ImagePreview from "../../components/UI/ImagePreview";
import { useRouter } from "expo-router";

const AddNewProductScreen = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    type: "",
    name: "",
    quality: "",
    price: "",
    description_content: "",
    owner: "",
  });
  const [errors, setErrors] = useState({});
  const [animationState, setAnimationState] = useState(null); // "success" or "error"
  const { addProduct, loading } = useProductStore();
  const { userId } = useSecureStore();
  const [isPopupVisible, setIsPopupVisible] = useState(false); // Thêm trạng thái cho PopupSuccess

  const {
    images,
    pickImage,
    uploadImages,
    loading: uploadingImages,
    removeImage,
  } = useUploadMultipleImages("products");
  const {
    video,
    pickVideo,
    uploadVideo,
    setVideo,
    uploading: uploadingVideo,
  } = useUploadVideo("products");

  useEffect(() => {
    if (userId) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        owner: userId,
      }));
    } else {
      console.error("User ID is missing. Please log in again.");
    }
  }, [userId]);

  const handleInputChange = (field, value) => {
    let validatedValue = value;

    if (field === "price" || field === "quality") {
      validatedValue = value.replace(/[^0-9]/g, "");
    }

    if (field === "name") {
      validatedValue = value.replace(/[^a-zA-Z0-9\s]/g, "").slice(0, 50);
    }

    setFormData({ ...formData, [field]: validatedValue });

    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.type) newErrors.type = "Type is required.";
    if (!formData.name) newErrors.name = "Name is required.";
    if (!formData.quality || isNaN(formData.quality) || formData.quality < 1)
      newErrors.quality = "Quality must be a positive number.";
    if (!formData.price || isNaN(formData.price) || formData.price <= 0)
      newErrors.price = "Price must be a positive number.";
    if (!formData.description_content)
      newErrors.description_content = "Description content is required.";
    if (!images || images.length === 0) newErrors.images = "Please upload at least one image.";
    if (!formData.owner) newErrors.owner = "Owner ID is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

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

  const handleSubmit = async () => {
    // Validate form first
    if (!validateForm()) {
      console.log("Validation failed:", errors);
      return;
    }

    try {
      const uploadedImages = await handleImageUpload();
      if (uploadingImages) {
        console.log("Still uploading images, please wait...");
        return;
      }

      // Log image upload results
      console.log("Starting image upload...");
      console.log("Uploaded Images:", uploadedImages);

      if (!uploadedImages || uploadedImages.length === 0) {
        throw new Error("No valid images uploaded.");
      }

      // Handle video upload if present
      let uploadedVideo = null;
      if (video) {
        console.log("Starting video upload...");
        uploadedVideo = await uploadVideo();
        console.log("Uploaded Video:", uploadedVideo);
      }

      // Build product data
      const productData = {
        type: formData.type,
        name: formData.name,
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quality, 10) || 1,
        description_content: formData.description_content,
        description_imgs: uploadedImages, // Use all uploaded images
        img: uploadedImages[0], // Set the first image as the primary image
        video: uploadedVideo,
        owner: userId,
      };

      console.log("Submitting product data:", productData);

      // Call the API to save product
      await addProduct(productData);

      setAnimationState("success");
      setIsPopupVisible(true);
      setTimeout(() => {
        setIsPopupVisible(false);
        router.push("/HomePage");
      }, 2000);
    } catch (error) {
      console.error("Error during submission:", error);
      setAnimationState("error");
    }
  };

  const resetForm = () => {
    setFormData({
      type: "",
      name: "",
      quality: "",
      price: "",
      description_content: "",
      owner: "",
    });
    setVideo(null);
    setErrors({});
  };

  const closePopup = () => {
    setAnimationState(null);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScreenWrapper>
        <Header title="Add New Product" showBackButton backButtonPress={() => router.back()} />
        <ScrollView contentContainerStyle={styles.container}>
          <TouchableOpacity onPress={pickImage} style={styles.uploadBox}>
            <Text style={styles.uploadText}>POST 1 TO 6 PHOTOS</Text>
          </TouchableOpacity>
          <ImagePreview images={images} onRemove={removeImage} />
          {errors.images && <Text style={styles.errorText}>{errors.images}</Text>}

          <TouchableOpacity onPress={pickVideo} style={styles.uploadBox}>
            <Text style={styles.uploadText}>POST MAXIMUM 1 VIDEO</Text>
          </TouchableOpacity>
          {video && (
            <View style={styles.videoPreviewContainer}>
              <Video
                source={{ uri: video }}
                style={styles.videoPlayer}
                useNativeControls
                resizeMode="contain"
              />
              <TouchableOpacity onPress={() => setVideo(null)} style={styles.removeVideoButton}>
                <Text style={styles.removeVideoText}>Remove Video</Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.fieldContainer}>
            <Picker
              selectedValue={formData.type}
              onValueChange={(value) => handleInputChange("type", value)}
              style={styles.picker}
            >
              <Picker.Item label="Select Type *" value="" />
              <Picker.Item label="Clothing" value="clothing" />
              <Picker.Item label="Electronics" value="electronics" />
              <Picker.Item label="Furniture" value="furniture" />
              <Picker.Item label="Books" value="books" />
            </Picker>
            {errors.type && <Text style={styles.errorText}>{errors.type}</Text>}
          </View>

          <TextInput
            style={[styles.input, errors.name && styles.errorBorder]}
            placeholder="Name *"
            value={formData.name}
            onChangeText={(value) => handleInputChange("name", value)}
          />
          {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

          <TextInput
            style={[styles.input, errors.quality && styles.errorBorder]}
            placeholder="Quality *"
            keyboardType="number-pad"
            returnKeyType="done"
            value={formData.quality}
            onChangeText={(value) => handleInputChange("quality", value)}
          />
          {errors.quality && <Text style={styles.errorText}>{errors.quality}</Text>}

          <TextInput
            style={[styles.input, errors.price && styles.errorBorder]}
            placeholder="Price *"
            keyboardType="number-pad"
            returnKeyType="done"
            value={formData.price}
            onChangeText={(value) => handleInputChange("price", value)}
          />
          {errors.price && <Text style={styles.errorText}>{errors.price}</Text>}

          <TextInput
            style={[
              styles.input,
              styles.textArea,
              errors.description_content && styles.errorBorder,
            ]}
            returnKeyType="done"
            placeholder="Description *"
            multiline
            numberOfLines={4}
            value={formData.description_content}
            onChangeText={(value) => handleInputChange("description_content", value)}
          />
          {errors.description_content && (
            <Text style={styles.errorText}>{errors.description_content}</Text>
          )}

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={resetForm}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.applyButton}
              onPress={handleSubmit}
              disabled={loading || uploadingImages || uploadingVideo}
            >
              {loading || uploadingImages || uploadingVideo ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.applyButtonText}>Apply</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
        <PopupSuccess visible={isPopupVisible} onClose={() => setIsPopupVisible(false)} />
      </ScreenWrapper>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#fff",
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
  videoPreviewContainer: {
    marginVertical: 15,
    alignItems: "center",
  },
  fieldContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 15,
    padding: 10,
  },
  videoPlayer: {
    width: "100%",
    height: 200,
  },
  removeVideoButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "red",
    borderRadius: 5,
  },
  removeVideoText: {
    color: "white",
    fontWeight: "bold",
  },
  picker: {
    width: "100%",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  errorBorder: {
    borderColor: "red",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cancelButton: {
    backgroundColor: "#ccc",
    padding: 15,
    borderRadius: 8,
    flex: 1,
    marginRight: 10,
  },
  cancelButtonText: {
    textAlign: "center",
    color: "#000",
    fontWeight: "bold",
  },
  applyButton: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 8,
    flex: 1,
  },
  applyButtonText: {
    textAlign: "center",
    color: "#fff",
    fontWeight: "bold",
  },
});

export default AddNewProductScreen;
