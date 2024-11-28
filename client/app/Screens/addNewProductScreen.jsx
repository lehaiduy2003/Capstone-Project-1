import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
} from "react-native";
import LottieView from "lottie-react-native";
import { Picker } from "@react-native-picker/picker";
import useProductStore from "../../store/useProductStore";
import ScreenWrapper from "../../components/ScreenWrapper";
import Header from "../../components/Header";
import Icon from "../../assets/icons";

const AddNewProductScreen = () => {
  const [formData, setFormData] = useState({
    type: "",
    name: "",
    quality: "",
    price: "",
    description: "",
    images: [], // Will handle later for uploads
    video: null, // Single video upload
  });

  const [animationState, setAnimationState] = useState(null); // "success" or "error"
  const { addProduct, loading } = useProductStore();

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async () => {
    if (
      !formData.type ||
      !formData.name ||
      !formData.quality ||
      !formData.price ||
      !formData.description
    ) {
      Alert.alert("Validation Error", "All fields marked with * are required!");
      return;
    }

    const productData = {
      type: formData.type,
      name: formData.name,
      price: parseFloat(formData.price),
      description: {
        content: formData.description,
        imgs: formData.images,
      },
      img: formData.images.length > 0 ? formData.images[0] : null,
      status: true,
    };

    try {
      await addProduct(productData);
      setAnimationState("success");
      setTimeout(() => {
        setAnimationState(null);
        setFormData({
          type: "",
          name: "",
          quality: "",
          price: "",
          description: "",
          images: [],
          video: null,
        });
      }, 2000);
    } catch (err) {
      console.error(err);
      setAnimationState("error");
      setTimeout(() => setAnimationState(null), 2000);
    }
  };

  return (
    <ScreenWrapper>
      <Header title="Add New Product" showBackButton />
      <ScrollView contentContainerStyle={styles.container}>
        {/* Image Upload Placeholder */}
        <TouchableOpacity style={styles.uploadBox}>
          <Icon name="camera" size={26} />
          <Text style={styles.uploadText}>POST 1 TO 6 PHOTOS</Text>
        </TouchableOpacity>

        {/* Video Upload Placeholder */}
        <TouchableOpacity style={styles.uploadBox}>
          <Text style={styles.uploadText}>POST MAXIMUM 1 VIDEO</Text>
        </TouchableOpacity>

        {/* Type Picker */}
        <Picker
          selectedValue={formData.type}
          onValueChange={(value) => handleInputChange("type", value)}
          style={styles.picker}
        >
          <Picker.Item label="Select Type *" value="" />
          <Picker.Item label="Clothing" value="clothing" />
          <Picker.Item label="Electronics" value="electronics" />
          <Picker.Item label="Furniture" value="furniture" />
        </Picker>

        {/* Text Inputs */}
        <TextInput
          style={styles.input}
          placeholder="Name *"
          value={formData.name}
          onChangeText={(value) => handleInputChange("name", value)}
        />
        <TextInput
          style={styles.input}
          placeholder="Quality *"
          value={formData.quality}
          onChangeText={(value) => handleInputChange("quality", value)}
        />
        <TextInput
          style={styles.input}
          placeholder="Price *"
          keyboardType="numeric"
          value={formData.price}
          onChangeText={(value) => handleInputChange("price", value)}
        />
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Description *"
          multiline
          numberOfLines={4}
          value={formData.description}
          onChangeText={(value) => handleInputChange("description", value)}
        />

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.cancelButton}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.applyButton}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.applyButtonText}>Apply</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Success/Error Animation */}
        {animationState === "success" && (
          <LottieView
            source={require("../../assets/animation/animation_success.json")}
            autoPlay
            loop={false}
            style={styles.animation}
          />
        )}
        {animationState === "error" && (
          <LottieView
            source={require("../../assets/animation/animation_failed.json")}
            autoPlay
            loop={false}
            style={styles.animation}
          />
        )}
      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
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
  picker: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 15,
    padding: 10,
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
  animation: {
    width: 150,
    height: 150,
    alignSelf: "center",
    marginTop: 20,
  },
});

export default AddNewProductScreen;
