import { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import useSecureStore from "../store/useSecureStore";
/**
 *
 * @param {string} folder the folder in Cloudinary to upload the image to, only 3 valid folder: ```users, products, campaigns.```
 * @returns
 */

const UPLOAD_LIMIT = 10; // Limit the number of images to upload
const useUploadMultipleImages = (folder) => {
  const [images, setImages] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const { accessToken, userId } = useSecureStore();

  const pickImage = async () => {
    // Request permission to access the media library
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Sorry, we need camera roll permissions to make this work!");
      return;
    }

    // Launch the image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: folder === "users", // Only allow editing for user profile pictures
      mediaTypes: ["images"], // Only images are allowed
      quality: 1,
      allowsMultipleSelection: true, // Allow multiple images to be selected
    });

    // Save the images uri
    if (!result.canceled) {
      const selectedImages = result.assets.map((asset) => asset.uri);
      if (images.length + selectedImages.length > UPLOAD_LIMIT) {
        alert(`You can only upload a maximum of ${UPLOAD_LIMIT} images`);
        return;
      }
      setImages((prevImages) => [...prevImages, ...selectedImages]);
    }
  };

  const takePhoto = async () => {
    // Request permission to access the camera
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      alert("Sorry, we need camera permissions to make this work!");
      return;
    }

    // Launch the camera
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: folder === "users", // Only allow editing for user profile pictures
      aspect: [4, 3],
      quality: 1,
    });

    // Save the images uri
    if (!result.canceled) {
      const selectedImages = result.assets.map((asset) => asset.uri);
      if (images.length + selectedImages.length > UPLOAD_LIMIT) {
        alert(`You can only upload a maximum of ${UPLOAD_LIMIT} images`);
        return;
      }
      setImages((prevImages) => [...prevImages, ...selectedImages]);
    }
  };

  // Start upload all images to Cloudinary
  const uploadImages = async () => {
    if (!images) {
      alert("No image selected");
      return;
    }

    setUploading(true);
    setError(null);

    try {
      // Get signature from server first after uploading the images
      const signatureResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cloudinary/sign`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          userId,
          folder,
        }),
      });
      const signatureData = await signatureResponse.json();
      const { signature, apiKey, timestamp, uploadPreset } = signatureData;

      // Upload all images concurrently
      const uploadPromises = images.map(async (image) => {
        // Get blob from image uri (for file name and type)
        const blobResponse = await fetch(image);
        const blob = await blobResponse.blob();
        const fileName = image.split("/").pop() || "uploaded_image.jpg";

        // Create form data to upload image
        const formData = new FormData();
        formData.append("file", {
          uri: image,
          name: fileName,
          type: blob.type || "image/jpeg",
        });
        formData.append("upload_preset", uploadPreset);
        formData.append("api_key", apiKey);
        formData.append("timestamp", timestamp);
        formData.append("signature", signature);

        // Upload image to Cloudinary
        // no need to await here because we are using Promise.all
        // for running all promises concurrently
        return fetch(`${process.env.EXPO_PUBLIC_CLOUDINARY_API}/image/upload`, {
          method: "POST",
          body: formData,
        }).then((response) => {
          if (!response.ok) {
            throw new Error("Failed to upload image");
          }
          return response.json();
        });
      });

      const uploadResult = await Promise.all(uploadPromises);

      const imagesUrl = uploadResult.map((data) => data.secure_url);
      alert("Image uploaded successfully");
      return imagesUrl;
    } catch (err) {
      setError(err.message);
      alert("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  return {
    images,
    uploading,
    error,
    pickImage,
    takePhoto,
    uploadImages,
  };
};

export default useUploadMultipleImages;
