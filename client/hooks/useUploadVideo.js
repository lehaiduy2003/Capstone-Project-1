import { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import useSecureStore from "../store/useSecureStore";
const useUploadVideo = (folder = "products") => {
  const [video, setVideo] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const { accessToken, userId } = useSecureStore();

  const pickVideo = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        alert("Permission to access media library is required.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        quality: 1,
      });

      if (!result.canceled && result.assets) {
        setVideo(result.assets[0].uri);
        console.log("Selected Video URI:", result.assets[0].uri);
      } else {
        console.log("Video picker canceled or no assets found.");
      }
    } catch (err) {
      console.error("Error during video selection:", err);
      alert("Failed to pick video.");
    }
  };

  const uploadVideo = async () => {
    if (!video) {
      alert("No video selected.");
      return null;
    }

    setUploading(true);
    setError(null);

    try {
      console.log("Requesting signature from backend...");
      const signatureResponse = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/cloudinary/sign`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ userId, folder }),
      });

      if (!signatureResponse.ok) {
        const errorText = await signatureResponse.text();
        console.error("Signature Error Response:", errorText);
        throw new Error("Failed to get upload signature. Check backend or ngrok setup.");
      }

      const { signature, apiKey, timestamp, uploadPreset } = await signatureResponse.json();
      console.log("Signature Data:", {
        signature,
        apiKey,
        timestamp,
        uploadPreset,
      });

      // Validate signature generation logic consistency
      const expectedStringToSign = `timestamp=${timestamp}&upload_preset=${uploadPreset}`;
      console.log("String to Sign:", expectedStringToSign);

      const formData = new FormData();
      formData.append("file", {
        uri: video,
        type: "video/mp4",
        name: video.split("/").pop() || "uploaded_video.mp4",
      });
      formData.append("upload_preset", uploadPreset);
      formData.append("api_key", apiKey);
      formData.append("timestamp", timestamp);
      formData.append("signature", signature);

      console.log("Uploading video to Cloudinary...");
      const uploadResponse = await fetch(`${process.env.EXPO_PUBLIC_CLOUDINARY_API}/video/upload`, {
        method: "POST",
        body: formData,
      });

      if (!uploadResponse.ok) {
        const errorText = await uploadResponse.text();
        console.error("Upload Error Response:", errorText);
        throw new Error("Failed to upload video. Check Cloudinary configuration.");
      }

      const data = await uploadResponse.json();
      console.log("Video uploaded successfully:", data.secure_url);
      return data.secure_url;
    } catch (err) {
      console.error("Error during video upload:", err);
      alert("Video upload failed. Please check network and backend settings.");
      setError(err.message);
      return null;
    } finally {
      setUploading(false);
    }
  };

  return {
    video,
    uploading,
    error,
    pickVideo,
    uploadVideo,
    setVideo,
  };
};

export default useUploadVideo;
