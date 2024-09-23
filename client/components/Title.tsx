import React from "react";
import { Text, TextStyle } from "react-native";

interface Props {
  title: string;
  fontSize?: number;
  fontWeight?: TextStyle["fontWeight"];
  fontStyle?: TextStyle["fontStyle"];
  fontFamily?: string;
  color?: string;
}

const Title = ({
  title,
  fontSize = 30,
  fontWeight = "condensedBold",
  fontFamily = "sans-serif",
  fontStyle = "normal",
  color = "black",
}: Props) => {
  return (
    <Text
      style={{
        fontSize: fontSize,
        fontWeight: fontWeight,
        fontFamily: fontFamily,
        fontStyle: fontStyle,
        color: color,
      }}
    >
      {title}
    </Text>
  );
};

export default Title;
