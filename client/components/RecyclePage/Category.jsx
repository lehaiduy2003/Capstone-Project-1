import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
} from "react-native";
import { hp, wp } from "../../helpers/common";
import  { theme } from "../../constants/theme";

function Category({ categories, onSelectCategory }) {
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.categoryItem}
      onPress={() => onSelectCategory(item)}
    >
      <Image source={item.image} style={styles.categoryImage} />
      <Text style={styles.categoryText}>{item.name}</Text>
    </TouchableOpacity>
  );
  return (
    <View style={styles.container}>
      <FlatList
        data={categories} // danh sách các danh mục
        renderItem={renderItem} // phương thức render cho từng item
        keyExtractor={(item) => item.id.toString()} // khóa duy nhất cho mỗi item
        horizontal={true} // cuộn ngang
        showsHorizontalScrollIndicator={false} // ẩn thanh cuộn
      />
    </View>
  );
}

export default Category;

const styles = StyleSheet.create({
  container: {
      paddingVertical: 5,
  },
  categoryItem: {
      alignItems: 'center',
      marginHorizontal: 10,
  },
  categoryImage: {
      width: wp(50),  
      height: hp(20),
      borderRadius: 20, 
      marginBottom: 6,
      
  },
  categoryText: {
      fontSize: 14,
      fontWeight: 'bold',
      textAlign: 'center',
  },

});
