import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { hp } from "../helpers/common";
import { theme } from "../constants/theme";
import Icon from "react-native-vector-icons/MaterialIcons";

const InputPass = ({ icon, ...props }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={[styles.container, props.containerStyles]}>
      {icon && icon}
      <TextInput
        style={{ flex: 1 }}
        placeholderTextColor={theme.colors.textLight}
        {...props} // Truyền các props còn lại (bao gồm cả password và setPassword)
        secureTextEntry={!showPassword}
      />
      <TouchableOpacity
        style={styles.iconContainer}
        onPress={() => setShowPassword(!showPassword)}
      >
        <Icon
          name={showPassword ? "visibility" : "visibility-off"}
          size={24}
          color="gray"
        />
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
