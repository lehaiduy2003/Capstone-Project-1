import React, { useState, useEffect } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons"; // For the edit icon
import useUserStore from "../../store/useUserStore";
import useSecureStore from "../../store/useSecureStore";
import ScreenWrapper from "../../components/ScreenWrapper";
import Header from "../../components/Header";
import Button from "../../components/Button";
import EditableField from "../../components/UI/EditableField";
import GenderField from "../../components/UI/GenderField";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Platform } from "react-native";
import { useRouter } from "expo-router";

const UserProfile = () => {
  const router = useRouter();
  const { userId } = useSecureStore();
  const { user, fetchUserData, loading, error, updateUserProfile } = useUserStore();

  // Local state to manage editable fields
  const [editableFields, setEditableFields] = useState({});
  const [formData, setFormData] = useState({});
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false); // State to control date picker visibility

  useEffect(() => {
    if (userId) {
      fetchUserData(userId);
    }
  }, [userId]);

  // Update local state when user data is fetched
  useEffect(() => {
    if (user) {
      const formattedUser = {
        ...user,
        dob: user.dob ? new Date(user.dob) : null, // Ensure dob is a Date object
        address: Array.isArray(user.address) ? user.address.join(", ") : user.address || "",
        gender: user.gender === true ? "Male" : user.gender === false ? "Female" : "Other",
      };
      setFormData(formattedUser);
    }
  }, [user]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB"); // Converts to "dd/mm/yyyy" format
  };

  const toggleEdit = (field) => {
    setEditableFields((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value, // Update form data locally
    }));
  };
  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || formData.dob;
    setIsDatePickerVisible(Platform.OS === "ios"); // Hide the picker on Android after selection
    handleChange("dob", currentDate);
  };

  // const handleSubmit = async () => {
  //   try {
  //     // Ensure gender is valid
  //     if (formData.gender !== "Male" && formData.gender !== "Female") {
  //       Alert.alert("Error", "Please select a valid gender.");
  //       return;
  //     }

  //     // Format data before submitting
  //     const formatToDDMMYYYY = (date) => {
  //       const d = new Date(date);
  //       const day = String(d.getDate()).padStart(2, "0");
  //       const month = String(d.getMonth() + 1).padStart(2, "0");
  //       const year = d.getFullYear();
  //       return `${day}-${month}-${year}`;
  //     };

  //     const formattedDOB = formData.dob ? formatToDDMMYYYY(formData.dob) : null;
  //     const formattedAddress = Array.isArray(formData.address)
  //       ? formData.address
  //       : [formData.address];
  //     const genderAsBoolean = formData.gender === "Male" ? true : false; // Default to false for other cases

  //     const formattedData = {
  //       ...formData,
  //       dob: formattedDOB,
  //       address: formattedAddress,
  //       gender: genderAsBoolean,
  //     };

  //     await updateUserProfile(userId, formattedData);

  //     Alert.alert("Success", "Profile updated successfully!");
  //   } catch (err) {
  //     console.error("Error updating user profile:", err);
  //     Alert.alert("Error", err.message || "Failed to update profile.");
  //   }
  // };

  const handleSubmit = async () => {
    try {
      // Format data before submitting
      const formatToDDMMYYYY = (date) => {
        const d = new Date(date);
        const day = String(d.getDate()).padStart(2, "0");
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const year = d.getFullYear();
        return `${day}-${month}-${year}`;
      };

      const formattedDOB = formData.dob ? formatToDDMMYYYY(formData.dob) : null;
      const formattedAddress = Array.isArray(formData.address)
        ? formData.address
        : [formData.address];

      // Ensure gender is valid and convert to the expected format
      const genderAsBoolean =
        formData.gender === "Male" ? true : formData.gender === "Female" ? false : null;

      if (genderAsBoolean === null) {
        Alert.alert("Error", "Please select a valid gender.");
        return;
      }

      const formattedData = {
        ...formData,
        dob: formattedDOB,
        address: formattedAddress,
        gender: genderAsBoolean, // Ensure gender is properly formatted
      };

      console.log("Submitting data:", formattedData); // Debug log

      await updateUserProfile(userId, formattedData);
      Alert.alert("Success", "Profile updated successfully!");
    } catch (err) {
      console.error("Error updating user profile:", err);
      Alert.alert("Error", err.message || "Failed to update profile.");
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>No user data found. Please try again.</Text>
      </View>
    );
  }

  return (
    <ScreenWrapper>
      <Header title="User Profile" showBackButton backButtonPress={() => router.back()} />

      {/* Avatar Section */}
      <View style={styles.avatarContainer}>
        <Image
          source={
            user.avatar
              ? { uri: user.avatar } // Use the user's avatar if available
              : require("../../assets/images/defaultUser.png") // Fallback to a default avatar
          }
          style={styles.avatar}
        />
        {/* Full Name */}
        <EditableField
          label="Full Name"
          value={formData.name || ""}
          editable={editableFields.name}
          onEdit={() => toggleEdit("name")}
          onChangeText={(text) => handleChange("name", text)}
        />

        <EditableField
          label="Address"
          value={formData.address || ""}
          editable={editableFields.address}
          onEdit={() => toggleEdit("address")}
          onChangeText={(text) => handleChange("address", text)}
        />

        {/* Date of Birth Field */}
        <View style={styles.fieldContainer}>
          <View style={styles.labelContainer}>
            <Text style={styles.label}>Date of Birth</Text>
            <TouchableOpacity onPress={() => setIsDatePickerVisible(true)}>
              <Ionicons name="create-outline" size={20} color="#007AFF" />
            </TouchableOpacity>
          </View>
          <TextInput
            style={styles.input}
            editable={false} // Ensure the field cannot be manually typed
            value={formData.dob ? formData.dob.toLocaleDateString("en-GB") : ""}
          />
        </View>
        {isDatePickerVisible && (
          <DateTimePicker
            value={formData.dob || new Date()}
            mode="date"
            display={Platform.OS === "ios" ? "inline" : "default"}
            onChange={(event, selectedDate) => {
              setIsDatePickerVisible(false); // Close picker
              if (selectedDate) {
                handleChange("dob", selectedDate); // Update formData with the new DOB
              }
            }}
          />
        )}

        <EditableField
          label="Phone Number"
          value={formData.phone || ""}
          editable={editableFields.phone}
          onEdit={() => toggleEdit("phone")}
          onChangeText={(text) => handleChange("phone", text)}
        />

        <GenderField
          gender={formData.gender} // Pass the string value ("Male", "Female", "Other")
          editable={editableFields.gender}
          onEdit={() => toggleEdit("gender")}
          onGenderChange={(value) => {
            console.log("Gender selected:", value); // Debug: Log the selected gender
            handleChange("gender", value); // Update the gender in formData
          }}
        />

        {isDatePickerVisible && (
          <DateTimePicker
            value={formData.dob || new Date()}
            mode="date"
            display={Platform.OS === "ios" ? "inline" : "default"}
            onChange={handleDateChange}
          />
        )}
        <Button title="Submit" onPress={handleSubmit} />
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  avatarContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 18,
    color: "#333",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 16,
    color: "red",
    textAlign: "center",
  },
  fieldContainer: {
    marginBottom: 20,
    width: "85%",
    alignSelf: "center",
  },
  labelContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
});

export default UserProfile;
