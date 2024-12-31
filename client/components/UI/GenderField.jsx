import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const GenderField = ({ gender, editable, onEdit, onGenderChange }) => (
  <View style={styles.fieldContainer}>
    <Text style={styles.label}>Gender:</Text>
    {editable ? (
      <View style={styles.genderOptions}>
        {["Male", "Female", "Other"].map((option) => (
          <TouchableOpacity
            key={option}
            style={styles.optionButton}
            onPress={() => onGenderChange(option)}
          >
            <Text style={styles.optionText}>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>
    ) : (
      <Text style={styles.input}>{gender || "Not specified"}</Text>
    )}
    <TouchableOpacity style={styles.iconContainer} onPress={onEdit}>
      <Ionicons
        name={editable ? "checkmark" : "pencil"}
        size={20}
        color={editable ? "green" : "gray"}
      />
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  fieldContainer: {
    marginBottom: 20,
    width: "85%",
    alignSelf: "center",
    position: "relative",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  genderOptions: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  optionButton: {
    backgroundColor: "#f5f5f5",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  optionText: {
    fontSize: 16,
  },
  input: {
    fontSize: 16,
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: "#f5f5f5",
    borderColor: "#ccc",
    height: 50,
    textAlignVertical: "center",
    width: "100%",
  },
  iconContainer: {
    position: "absolute",
    right: 10,
    top: "50%",
    transform: [{ translateY: -10 }],
  },
});

export default GenderField;
