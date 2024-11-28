import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Modal,
} from "react-native";
import LottieView from "lottie-react-native";
import Button from "../components/Button";

const ProductEditForm = ({ visible, product, onSave, onCancel }) => {
  const [updatedProduct, setUpdatedProduct] = useState(product);
  const [updateStatus, setUpdateStatus] = useState(null); // "success", "failure", or null

  useEffect(() => {
    setUpdatedProduct(product);
  }, [product]);

  const handleInputChange = (field, value) => {
    setUpdatedProduct((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleDescriptionChange = (field, value) => {
    setUpdatedProduct((prev) => ({
      ...prev,
      description: {
        ...prev.description,
        [field]: value,
      },
    }));
  };

  const handleImagesChange = (value) => {
    const imagesArray = value.split(",").map((url) => url.trim());
    setUpdatedProduct((prev) => ({
      ...prev,
      description: {
        ...prev.description,
        imgs: imagesArray,
      },
    }));
  };

  const handleSubmit = () => {
    if (!updatedProduct.name || !updatedProduct.price || !updatedProduct.img) {
      setUpdateStatus("failure"); // Trigger failure animation
      setTimeout(() => {
        setUpdateStatus(null);
      }, 2000);
      return;
    }

    const saveResult = onSave(updatedProduct); // Simulating save logic
    if (saveResult) {
      setUpdateStatus("success"); // Trigger success animation
    } else {
      setUpdateStatus("failure"); // Trigger failure animation
    }

    setTimeout(() => {
      setUpdateStatus(null);
      if (saveResult) {
        onCancel(); // Close the modal only on success
      }
    }, 2000);
  };

  if (updateStatus) {
    const animationSource =
      updateStatus === "success"
        ? require("../assets/animation/animation_success.json")
        : require("../assets/animation/animation_failed.json");

    return (
      <Modal visible={visible} transparent={true}>
        <View style={styles.modalContainer}>
          <LottieView
            source={animationSource}
            autoPlay
            loop={false}
            style={styles.animation}
          />
          <Text style={styles.statusText}>
            {updateStatus === "success"
              ? "Updated Successfully!"
              : "Update Failed!"}
          </Text>
        </View>
      </Modal>
    );
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onCancel}
    >
      <View style={styles.modalContainer}>
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            keyboardShouldPersistTaps="handled"
          >
            <Text style={styles.header}>Edit Product</Text>

            <TextInput
              style={styles.input}
              placeholder="Name"
              value={updatedProduct.name}
              onChangeText={(text) => handleInputChange("name", text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Price"
              value={String(updatedProduct.price)}
              keyboardType="numeric"
              onChangeText={(text) => handleInputChange("price", Number(text))}
            />
            <TextInput
              style={styles.input}
              placeholder="Main Image URL"
              value={updatedProduct.img}
              onChangeText={(text) => handleInputChange("img", text)}
            />
            <TextInput
              style={[styles.input, styles.multilineInput]}
              placeholder="Description Content"
              value={updatedProduct.description?.content || ""}
              multiline
              numberOfLines={4}
              onChangeText={(text) => handleDescriptionChange("content", text)}
            />
            <TextInput
              style={[styles.input, styles.multilineInput]}
              placeholder="Additional Images (comma-separated)"
              value={updatedProduct.description?.imgs?.join(", ") || ""}
              multiline
              onChangeText={handleImagesChange}
            />

            <View style={styles.buttonContainer}>
              <Button title="Save" onPress={handleSubmit} />
              <Button title="Cancel" onPress={onCancel} />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

export default ProductEditForm;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    margin: 20,
    borderRadius: 8,
    padding: 10,
  },
  scrollContainer: {
    padding: 20,
    alignItems: "center",
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
    backgroundColor: "#f9f9f9",
  },
  multilineInput: {
    height: 100,
    textAlignVertical: "top",
  },
  buttonContainer: {
    //flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    width: "100%",
  },
  animation: {
    width: 150,
    height: 150,
  },
  statusText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 20,
  },
});
