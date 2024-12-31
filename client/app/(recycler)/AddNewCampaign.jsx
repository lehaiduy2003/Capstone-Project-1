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
import { hp, wp } from "../../helpers/common";
import { theme } from "../../constants/theme";
import Button from "../../components/Button";
import Input from "../../components/Input";
import { getValueFor } from "../../utils/secureStore";
import useAuthSubmit from "../../hooks/useAuthSubmit";
import BackButton from "../../components/BackButton";
import { useRouter } from "expo-router";
import Icon from "../../assets/icons";
import PopupSuccess from "../../components/UI/PopUpSuccess";

const AddNewCampaign = () => {
  const [campaignName, setCampaignName] = useState("");
  const [campaignImage, setCampaignImage] = useState(null);
  const [description, setDescription] = useState("");
  const [descriptionImages, setDescriptionImages] = useState([]);
  const [guide, setGuide] = useState("");
  const [locationInput, setLocationInput] = useState("");
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [isPopupVisible, setIsPopupVisible] = useState(false); // Thêm trạng thái cho PopupSuccess

  const router = useRouter();

  const { onSubmit, loading } = useAuthSubmit(`${process.env.EXPO_PUBLIC_API_URL}/campaigns`);

  const pickImage = async (setImageFunction) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3], // Adjust aspect ratio as needed
      quality: 1,
    });

    if (!result.canceled) {
      setImageFunction(result.assets[0].uri);
    }
  };

  //add
  const handleAddLocation = () => {
    if (locationInput.trim()) {
      setSelectedLocations([...selectedLocations, locationInput.trim()]);
      setLocationInput("");
    }
  };
  //add

  const handleCreateCampaign = async () => {
    const userId = await getValueFor("userId");
    try {
      const formData = {
        name: campaignName,
        img: campaignImage,
        description_content: description,
        description_imgs: descriptionImages,
        guide: guide,
        creator_id: userId,
        location: selectedLocations,
      };

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
      if (response && response.campaign && response.campaign._id) {
        // Check if the response is valid and contains an _id
        // Alert.alert("Success", "Campaign created successfully!");
        // router.back();
        setIsPopupVisible(true);
        setTimeout(() => {
          setIsPopupVisible(false);
          router.push("/DonateRecycle");
        }, 2000);
      } else {
        Alert.alert("Error", response?.message || "Failed to create campaign.");
      }
    } catch (error) {
      console.error("Error creating campaign:", error);
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
          {/* Name Input */}
          <Input
            label="Name"
            placeholder="Enter campaign name"
            value={campaignName}
            onChangeText={setCampaignName}
            containerStyles={styles.inputContainer} // Apply container styles
            inputContainerStyle={styles.inputInnerContainer} // Apply inner container styles
            inputStyle={styles.input} // Apply input styles
          />
          {/* Campaign Image Upload */}
          <TouchableOpacity onPress={() => pickImage(setCampaignImage)} style={styles.uploadButton}>
            <View style={styles.uploadContainer}>
              <Text style={styles.label}>Upload avatar...</Text>
              <Icon name="image" size={24} color="gray" />
            </View>
          </TouchableOpacity>
          {campaignImage && <Image source={{ uri: campaignImage }} style={styles.previewImage} />}
          {/* Description Input */}
          <Input
            label="Description content..."
            placeholder="Enter description"
            value={description}
            onChangeText={setDescription}
            multiline
            containerStyles={styles.inputContainer}
            inputContainerStyle={[styles.inputInnerContainer, styles.multilineInputContainer]} // Combine inner and multiline container styles
            inputStyle={[styles.input, styles.multilineInput]} // Combine input and multiline input styles
          />
          {/* Description Images Upload */}
          <TouchableOpacity
            onPress={() => pickImage((uri) => setDescriptionImages([...descriptionImages, uri]))}
            style={styles.uploadButton}
          >
            <View style={styles.uploadContainer}>
              <Text style={styles.label}>Upload more images</Text>
              <Icon name="image" size={24} color="gray" />
            </View>
          </TouchableOpacity>
          <View style={styles.imageGrid}>
            {descriptionImages.map((image, index) => (
              <Image key={index} source={{ uri: image }} style={styles.gridImage} />
            ))}
          </View>
          {/* Guide Input */}
          <Input
            label="Guide"
            placeholder="Enter guide"
            value={guide}
            onChangeText={setGuide}
            multiline
            containerStyles={styles.inputContainer}
            inputContainerStyle={[styles.inputInnerContainer, styles.multilineInputContainer]}
            inputStyle={[styles.input, styles.multilineInput]}
          />
          {/* Location */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Location</Text>
            <View style={styles.locationInputContainer}>
              <TextInput
                style={styles.locationInput}
                placeholder="Enter location"
                value={locationInput}
                onChangeText={setLocationInput}
              />
              <TouchableOpacity style={styles.addButton} onPress={handleAddLocation}>
                <Text style={styles.addButtonText}>Add</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.selectedItemsContainer}>
              {selectedLocations.map((location, index) => (
                <View key={index} style={styles.selectedItem}>
                  <Text style={styles.selectedItemText}>{location}</Text>
                </View>
              ))}
            </View>
          </View>

          <Button
            title="Create new campaign"
            onPress={handleCreateCampaign}
            loading={loading}
            buttonStyle={styles.createButton}
          />
        </View>
      </ScrollView>
      <PopupSuccess visible={isPopupVisible} onClose={() => setIsPopupVisible(false)} />
    </KeyboardAvoidingView>
  );
};

// Add styles for AddNewCampaign
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

export default AddNewCampaign;
