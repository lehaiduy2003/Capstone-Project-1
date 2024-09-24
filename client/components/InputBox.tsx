import { Input } from "@rneui/themed";
import React from "react";
import { StyleSheet, ViewStyle } from "react-native";

interface Props {
  value: string;
  placeholder?: string;
  onChangeText?: (text: string) => void;
  style?: ViewStyle;
}

const InputBox = ({ value, placeholder = "", onChangeText, style }: Props) => {
  return (
    <Input
      value={value}
      placeholder={placeholder}
      leftIcon={{ type: "font-awesome", name: "envelope" }}
      inputContainerStyle={styles.input}
      inputStyle={{ paddingLeft: 10 }}
      onChangeText={onChangeText}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    width: "90%",
    marginLeft: 15,
    paddingLeft: 10,
    height: 50,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 20,
  },
});

export default InputBox;
