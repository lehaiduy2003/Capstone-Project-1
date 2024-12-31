import { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import useSecureStore from "../store/useSecureStore";
import { getValueFor } from "../utils/secureStore";

/**
 *
 * @param {string} folder the folder in Cloudinary to upload the image to, only 3 valid folder: ```users, products, campaigns.```
 * @returns
 */
const useUploadSingleImage = (folder) => {
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const { accessToken, userId } = useSecureStore();

  // Save the images uri
  const save = (result) => {
    if (!result.canceled) {
      setImage(result.assets[0].uri); // Save the image uri, only the first image is saved
    }
  };

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
      mediaTypes: ImagePicker.MediaTypeOptions.Images, // Only images are allowed
      quality: 1,
      allowsMultipleSelection: false, // Allow only one image to be selected
    });

    save(result);
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

    save(result);
  };

  const uploadImage = async () => {
    if (!image) {
      alert("No image selected");
      return;
    }

    setUploading(true);
    setError(null);

    try {
      // Get blob from image uri (for file name and type)
      const blobResponse = await fetch(image);
      const blob = await blobResponse.blob();
      const fileName = image.split("/").pop() || "uploaded_image.jpg";

      // Get signature from server
      const signatureResponse = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/cloudinary/sign`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            userId,
            folder,
          }),
        }
      );
      const signatureData = await signatureResponse.json();
      const { signature, apiKey, timestamp, uploadPreset } = signatureData;

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
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_CLOUDINARY_API}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to upload image");
      }

      const data = await response.json();
      alert("Image uploaded successfully");
      // Return the secure url of the uploaded image
      // this is the url to display the image and store in the database
      return data.secure_url;
    } catch (err) {
      setError(err.message);
      alert("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  return {
    image,
    uploading,
    error,
    pickImage,
    takePhoto,
    uploadImage,
  };
};

export default useUploadSingleImage;
