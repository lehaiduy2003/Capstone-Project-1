import React from "react";
import { Text, TextStyle } from "react-native";

interface Props {
  title: string;
  fontSize?: number;
  fontWeight?: TextStyle["fontWeight"];
  fontStyle?: TextStyle["fontStyle"];
  fontFamily?: string;
  paddingVertical?: number;
  paddingHorizontal?: number;
  color?: string;
}

const Title = ({
  title,
  fontSize = 30,
  fontWeight = "condensedBold",
  fontFamily = "sans-serif",
  fontStyle = "normal",
  paddingHorizontal = 0,
  paddingVertical = 0,
  color = "black",
}: Props) => {
  return (
    <Text
      style={{
        fontSize: fontSize,
        fontWeight: fontWeight,
        fontFamily: fontFamily,
        fontStyle: fontStyle,
        paddingHorizontal: paddingHorizontal,
        paddingVertical: paddingVertical,
        color: color,
      }}
    >
      {title}
    </Text>
  );
};

export default Title;
