import { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import useSecureStore from "../store/useSecureStore";

const UPLOAD_LIMIT = 6; // Limit the number of images to upload
const useUploadMultipleImages = (folder = "products") => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { accessToken, userId } = useSecureStore();

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        alert("Permission to access the media library is required.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsMultipleSelection: true,
        quality: 1,
      });

      if (!result.canceled && result.assets) {
        const newImages = result.assets.map((asset) => asset.uri);

        setImages((prevImages) => {
          const combinedImages = [...prevImages, ...newImages];
          if (combinedImages.length > UPLOAD_LIMIT) {
            alert(`You can only upload up to ${UPLOAD_LIMIT} images.`);
            return prevImages; // Keep existing images if limit exceeded
          }
          return combinedImages;
        });
      }
      console.log("Images selected:", images);
    } catch (err) {
      console.error("Error selecting images:", err);
      setError("Failed to pick images. Please try again");
    }
  };

  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        alert("Permission to access the camera is required.");
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: folder === "users",
        quality: 1,
      });

      if (!result.canceled && result.assets) {
        const newImageUri = result.assets[0].uri;

        setImages((prevImages) => {
          if (prevImages.length + 1 > UPLOAD_LIMIT) {
            alert(`You can only upload a maximum of ${UPLOAD_LIMIT} images.`);
            return prevImages;
          }
          return [...prevImages, newImageUri];
        });
      }
    } catch (err) {
      console.error("Error taking photo:", err);
      setError("Failed to take photo. Please try again.");
    }
  };

  const removeImage = (index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const uploadImages = async () => {
    if (!images || images.length === 0) {
      alert("No images selected to upload.");
      return [];
    }

    setLoading(true);
    setError(null);

    try {
      console.log("Requesting upload signature...");
      const signatureUrl = `${process.env.EXPO_PUBLIC_API_URL}/cloudinary/sign`;

      const signatureResponse = await fetch(signatureUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ userId, folder }),
      });

      if (!signatureResponse.ok) {
        const errorText = await signatureResponse.text();
        console.error("Signature error:", errorText);
        throw new Error("Failed to get upload signature.");
      }

      const { signature, apiKey, timestamp, uploadPreset } = await signatureResponse.json();
      console.log("Signature received:", {
        signature,
        apiKey,
        timestamp,
        uploadPreset,
      });

      const uploadPromises = images.map(async (imageUri, index) => {
        const formData = new FormData();
        formData.append("file", {
          uri: imageUri,
          type: "image/jpeg",
          name: `upload_${index}.jpg`,
        });
        formData.append("upload_preset", uploadPreset);
        formData.append("api_key", apiKey);
        formData.append("timestamp", timestamp);
        formData.append("signature", signature);
        formData.append("folder", folder); // Include the folder parameter

        const uploadUrl = `${process.env.EXPO_PUBLIC_CLOUDINARY_API}/image/upload`;
        console.log(`Uploading image ${index + 1} to ${uploadUrl}...`);

        const response = await fetch(uploadUrl, {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error(`Error uploading image ${index + 1}:`, errorText);
          throw new Error(`Failed to upload image ${index + 1}.`);
        }

        const data = await response.json();
        console.log(`Image ${index + 1} uploaded successfully:`, data.secure_url);
        return data.secure_url;
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      console.log("All images uploaded:", uploadedUrls);
      return uploadedUrls;
    } catch (err) {
      console.error("Image upload error:", err);
      setError("Failed to upload images. Please try again.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    images,
    loading,
    error,
    pickImage,
    takePhoto,
    uploadImages,
    removeImage,
    setImages,
  };
};

export default useUploadMultipleImages;
