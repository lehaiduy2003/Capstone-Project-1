import React from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const EditableField = ({ label, value, editable, onEdit, onChangeText }) => (
  <View style={styles.fieldContainer}>
    <Text style={styles.label}>{label}:</Text>
    <View style={styles.inputWrapper}>
      <TextInput
        style={styles.input}
        value={value}
        placeholder={`Enter your ${label.toLowerCase()}`}
        editable={editable}
        onChangeText={onChangeText}
      />
      <TouchableOpacity style={styles.iconContainer} onPress={onEdit}>
        <Ionicons
          name={editable ? "checkmark" : "pencil"}
          size={20}
          color={editable ? "green" : "gray"}
        />
      </TouchableOpacity>
    </View>
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
  inputWrapper: {
    position: "relative",
  },
  input: {
    fontSize: 16,
    padding: 10,
    paddingRight: 40,
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

export default EditableField;
