import { useRoute } from "@react-navigation/native";
import React from "react";
import { View, Text, StyleSheet, Image, Button } from "react-native";
import QRCode from "react-native-qrcode-svg";
import ScreenWrapper from "../../components/ScreenWrapper";
import Header from "../../components/Header";
import { useRouter } from "expo-router";
// import * as FileSystem from "expo-file-system";
// import * as MediaLibrary from "expo-media-library";
const qrCodeScreen = () => {
  const route = useRoute();
  const router = useRouter();
  const { qrCode } = route.params; // Extract the campaign data from route parameters

  console.log("qrCode", qrCode);

  // const downloadImage = async () => {
  //   try {
  //     // Request permission to access media library
  //     const { status } = await MediaLibrary.requestPermissionsAsync();
  //     if (status !== "granted") {
  //       Alert.alert("Permission denied", "We need permission to access your photo library.");
  //       return;
  //     }

  //     // Download the image to a temporary file
  //     const fileUri = FileSystem.documentDirectory + "qrCode.png";
  //     const { uri } = await FileSystem.downloadAsync(qrCode, fileUri);

  //     // Save the image to the media library
  //     const asset = await MediaLibrary.createAssetAsync(uri);
  //     await MediaLibrary.createAlbumAsync("QR Codes", asset, false);

  //     Alert.alert("Success", "QR Code has been saved to your photo library.");
  //   } catch (error) {
  //     console.error(error);
  //     Alert.alert("Error", "An error occurred while saving the QR Code.");
  //   }
  // };

  return (
    <ScreenWrapper>
      <Header
        title={"QR Code"}
        showBackButton
        backButtonPress={() => router.replace("HomePage")}
      ></Header>
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.label}>QR Code</Text>
          <Image
            source={{ uri: qrCode }}
            style={{ width: 300, height: 350 }}
            resizeMode="contain"
          />
          <Text style={styles.description}>
            Please attach this QR Code on your package before donate to campaign
          </Text>
          <Text style={styles.description}>
            Download this QR Code (or capture screen) for offline use
          </Text>
          {/* <Button title="Download QR Code" onPress={downloadImage} /> */}
        </View>
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
    alignItems: "center",
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
  description: {
    fontSize: 16,
    color: "#666",
    marginTop: 16,
    textAlign: "center",
  },
});

export default qrCodeScreen;
