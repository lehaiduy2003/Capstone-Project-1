import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  //   TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { hp, wp } from "../helpers/common";
import { theme } from "../constants/theme";
import Button from "../components/Button";
import Input from "../components/Input";
import MultiSelect from "react-native-multiple-select"; // You'll need to install this: npm install react-native-multiple-select
import { getValueFor } from "../utils/secureStore";
import useAuthSubmit from "../hooks/useAuthSubmit";
import BackButton from "../components/BackButton";
import { useRouter } from "expo-router";
import Icon from "../assets/icons";

const AddNewCampaign = () => {
  const [campaignName, setCampaignName] = useState("");
  const [campaignImage, setCampaignImage] = useState(null);
  const [description, setDescription] = useState("");
  const [descriptionImages, setDescriptionImages] = useState([]);
  const [guide, setGuide] = useState("");
  const [selectedLocations, setSelectedLocations] = useState([]);

  const [selectedItems, setSelectedItems] = useState([]);
  const items = [
    { id: "1", name: "Ha Noi" },
    { id: "2", name: "Da Nang" },
    { id: "3", name: "Ho Chi Minh" },
    // ... more locations
  ];
  const onSelectedItemsChange = (selectedItems) => {
    setSelectedItems(selectedItems);
    setSelectedLocations(selectedItems); // Update selectedLocations state
  };

  const router = useRouter();

  const { onSubmit, loading } = useAuthSubmit(
    `${process.env.EXPO_PUBLIC_API_URL}/campaigns`
  );

  const pickImage = async (setImageFunction) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3], // Adjust aspect ratio as needed
      quality: 1,
    });

    if (!result.canceled) {
      setImageFunction(result.assets[0].uri);
    }
  };

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
      // Handle success, maybe navigate back
      if (response && response._id) {
        // Check if the response is valid and contains an _id
        Alert.alert("Success", "Campaign created successfully!");
        router.back();
      } else {
        Alert.alert("Error", response?.message || "Failed to create campaign.");
      }
    } catch (error) {
      console.error("Error creating campaign:", error);
      Alert.alert("Error", error.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContent}>
      <View style={styles.container}>
        <BackButton router={router} />
        <Text style={styles.title}>Add New Campaign</Text>

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
        <View style={styles.uploadContainer}>
          <Text style={styles.label}>Upload avatar...</Text>
          <TouchableOpacity
            onPress={() => pickImage(setCampaignImage)}
            style={styles.uploadButton}
          >
            <Icon name="image" size={24} color="gray" />
          </TouchableOpacity>
        </View>
        {campaignImage && (
          <Image source={{ uri: campaignImage }} style={styles.previewImage} />
        )}

        {/* Description Input */}
        <Input
          label="Description content..."
          placeholder="Enter description"
          value={description}
          onChangeText={setDescription}
          multiline
          containerStyles={styles.inputContainer}
          inputContainerStyle={[
            styles.inputInnerContainer,
            styles.multilineInputContainer,
          ]} // Combine inner and multiline container styles
          inputStyle={[styles.input, styles.multilineInput]} // Combine input and multiline input styles
        />

        {/* Description Images Upload */}
        <View style={styles.uploadContainer}>
          <Text style={styles.label}>Upload more images</Text>
          <TouchableOpacity
            onPress={() =>
              pickImage((uri) =>
                setDescriptionImages([...descriptionImages, uri])
              )
            }
            style={styles.uploadButton}
          >
            <Icon name="image" size={24} color="gray" />
          </TouchableOpacity>
        </View>

        <View style={styles.imageGrid}>
          {descriptionImages.map((image, index) => (
            <Image
              key={index}
              source={{ uri: image }}
              style={styles.gridImage}
            />
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
          inputContainerStyle={[
            styles.inputInnerContainer,
            styles.multilineInputContainer,
          ]}
          inputStyle={[styles.input, styles.multilineInput]}
        />

        {/* Location */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Location</Text>
          <MultiSelect
            hideTags
            items={items}
            uniqueKey="id"
            onSelectedItemsChange={onSelectedItemsChange}
            selectedItems={selectedItems}
            selectText="Pick Locations"
            searchInputPlaceholderText="Search Items..."
            // Other styling and props for the MultiSelect
            tagRemoveIconColor="#CCC"
            tagBorderColor="#CCC"
            tagTextColor="#CCC"
            selectedItemTextColor="#CCC"
            selectedItemIconColor="#CCC"
            itemTextColor="#000"
            displayKey="name"
            searchInputStyle={{ color: "#CCC" }}
            submitButtonColor={theme.colors.primary}
            submitButtonText="Submit"
            styleDropdownMenuSubsection={{
              backgroundColor: "white", // Set background color to white
              borderRadius: theme.radius.md, // Apply rounded corners
            }}
          />
          {selectedItems.length > 0 && (
            <View style={styles.selectedItemsContainer}>
              {selectedItems.map((itemId) => {
                const item = items.find((i) => i.id === itemId);
                return (
                  <View key={itemId} style={styles.selectedItem}>
                    <Text style={styles.selectedItemText}>{item?.name}</Text>
                  </View>
                );
              })}
            </View>
          )}
        </View>

        <Button
          title="Create new campaign"
          onPress={handleCreateCampaign}
          loading={loading}
          buttonStyle={styles.createButton}
        />
      </View>
    </ScrollView>
  );
};

// Add styles for AddNewCampaign
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: wp(4),
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: hp(2.8),
    fontWeight: theme.fonts.bold,
    color: theme.colors.text,
    marginBottom: hp(2),
    textAlign: "center",
  },

  // Style for image preview
  previewImage: {
    width: 200,
    height: 200,
    resizeMode: "contain",
    marginVertical: 10,
    alignSelf: "center", // Center the image
  },

  // Styles for the image picker button
  imagePickerButton: {
    backgroundColor: theme.colors.primary,
    padding: 10,
    borderRadius: 5,
    alignSelf: "center", // Center the button
    marginVertical: 10,
  },
  imagePickerButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  inputContainer: {
    marginBottom: hp(2),
  },
  label: {
    fontSize: hp(1.8),
    fontWeight: theme.fonts.bold,
    color: theme.colors.text,
    marginBottom: hp(0.5),
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.gray,
    borderRadius: theme.radius.md,
    padding: wp(3),
    height: hp(6),
    backgroundColor: "white", // Set input background to white
  },
  multilineInput: {
    height: hp(15), // Increased height for multiline input
    textAlignVertical: "top",
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
    backgroundColor: "white", // Set input background to white
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
  scrollViewContent: {
    flexGrow: 1,
    padding: wp(4),
  },
  imageGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    marginVertical: 10,
  },
  gridImage: {
    width: (wp(100) - wp(4) * 2 - 10 * 3) / 3, // Three images per row with margin
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
    // Style for the outer container (label + input)
    marginBottom: hp(2),
  },
  inputInnerContainer: {
    // Style for the inner container (TextInput)
    borderWidth: 1,
    borderColor: theme.colors.gray,
    borderRadius: theme.radius.md,
    padding: wp(3),
    backgroundColor: "white",
    height: hp(6), // Default height
    flexDirection: "row",
    alignItems: "center",
  },
  multilineInputContainer: {
    // Style for multiline inner container
    height: hp(15),
  },
  input: {
    // Style for the TextInput itself
    flex: 1,
  },
  multilineInput: {
    textAlignVertical: "top",
  },
});

export default AddNewCampaign;
