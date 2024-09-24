import { Button } from "@rneui/themed";
import React from "react";
interface Props {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  iconName: "google" | "facebook";
  type: "antdesign" | "font-awesome";
}

const ThirtPartySignIn = ({
  title,
  onPress,
  disabled = false,
  iconName,
  type,
}: Props) => {
  return (
    <Button
      title={title}
      icon={{
        name: iconName,
        type: type,
        size: 25,
        color: "#00C26F",
      }}
      iconContainerStyle={{ marginRight: 20 }}
      titleStyle={{ fontWeight: "700", color: "black", fontSize: 20 }}
      buttonStyle={{
        backgroundColor: "#fff",
        borderWidth: 1,
        borderRadius: 30,
        borderColor: "black",
        height: 50,
      }}
      containerStyle={{
        width: 370,
        marginHorizontal: 50,
        marginVertical: 10,
        borderWidth: 1,
        borderRadius: 30,
        borderColor: "black",
      }}
      onPress={onPress}
      disabled={disabled}
    />
  );
};

export default ThirtPartySignIn;
