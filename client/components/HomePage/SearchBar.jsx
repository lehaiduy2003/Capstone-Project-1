import React from 'react';
import { View, StyleSheet } from 'react-native';
import Search from '../../components/Search';
import Icon from '../../assets/icons';
import { hp } from '../../helpers/common';
import { theme } from '../../constants/theme';

const nameRef = React.useRef("");

function SearchBar() {
  return (
    <View style={styles.row}>
    <Search
      icon={<Icon name="search" size={26} strokeWidth={1.6} />}
      placeholder="Search products, brands..."
      onChangeText={(value) => (nameRef.current = value)}
    />
    <Icon name="filter" size={hp(3.2)} strokeWidth={2} color={theme.colors.text} />
  </View>
  );
}

export default SearchBar

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 20,
  },
});
