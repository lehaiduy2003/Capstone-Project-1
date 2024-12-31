import { useState } from "react";
import { StyleSheet, View, TextInput } from "react-native";
import React from "react";
import { hp } from "../helpers/common";
import { theme } from "../constants/theme";
import { usePathname, useRouter } from "expo-router";
const Search = ({ searchType, ...props }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();
  const path = usePathname();
  const handleSearch = async () => {
    if (!searchTerm || !searchType) return;

    if (path === "/Screens/SearchResultScreen")
      router.replace(
        `Screens/SearchResultScreen?searchType=${searchType}&searchQuery=${searchTerm}`
      );
    else
      router.push(`Screens/SearchResultScreen?searchType=${searchType}&searchQuery=${searchTerm}`);
  };

  return (
    <View style={[styles.container, props.containerStyles && props.containerStyles]}>
      {props.icon && props.icon}
      <TextInput
        style={{ flex: 1 }}
        placeholderTextColor={theme.colors.textLight}
        ref={props.inputRef && props.inputRef}
        {...props}
        value={searchTerm}
        onChangeText={setSearchTerm}
        onSubmitEditing={handleSearch}
        returnKeyType="search"
      />
    </View>
  );
};

export default Search;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    height: hp(7.2),
    justifyContent: "center",
    borderWidth: 0.4,
    borderColor: "#F4F6F8",
    borderRadius: theme.radius.xl,
    paddingHorizontal: 18,
    gap: 12,
    backgroundColor: "#F4F6F8",
    marginRight: 10,
  },
});
