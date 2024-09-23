import React from "react";
import { View } from "react-native";

interface Props {
  flex?: number;
  bgColor?: string;
  alignItems?: "center" | "flex-start" | "flex-end" | "stretch" | "baseline";
  justifyContent?:
    | "center"
    | "flex-start"
    | "flex-end"
    | "space-between"
    | "space-around"
    | "space-evenly";
  paddingVertical?: number;
  paddingHorizontal?: number;
  children: React.ReactNode;
}

const Container = ({
  flex = 1,
  bgColor = "#fff",
  alignItems = "center",
  justifyContent = "center",
  paddingVertical = 0,
  paddingHorizontal = 0,
  children,
}: Props) => {
  return (
    <View
      style={{
        flex: flex,
        backgroundColor: bgColor,
        alignItems: alignItems,
        paddingVertical: paddingVertical,
        paddingHorizontal: paddingHorizontal,
        justifyContent: justifyContent,
      }}
    >
      {children}
    </View>
  );
};

export default Container;
