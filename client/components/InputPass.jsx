import { StyleSheet, View, TextInput, TouchableOpacity } from "react-native";
import React from "react";
import { hp } from "../helpers/common";
import { theme } from "../constants/theme";
import { useState } from "react";
import Icon from "react-native-vector-icons/MaterialIcons";

const InputPass = (props, status) => {
  const [showPassword, setshowPassword] = useState(false);
  return (
    <View style={[styles.container, props.containerStyles && props.containerStyles]}>
      {props.icon && props.icon}
      <TextInput
        style={{
          flex: 1,
          borderColor: status ? theme.colors.rose : theme.colors.text,
        }}
        placeholderTextColor={theme.colors.textLight}
        textContentType={"oneTimeCode"}
        ref={props.inputRef && props.inputRef}
        {...props}
        secureTextEntry={!showPassword}
      />
      <TouchableOpacity onPress={() => setshowPassword(!showPassword)}>
        <Icon name={showPassword ? "visibility" : "visibility-off"} size={24} color="gray" />
      </TouchableOpacity>
    </View>
  );
};

export default InputPass;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    height: hp(7.2),
    justifyContent: "center",
    borderWidth: 0.4,
    borderColor: theme.colors.text,
    borderRadius: theme.radius.xxl,
    borderCurve: "continuous",
    paddingHorizontal: 18,
    gap: 12,
  },
});
