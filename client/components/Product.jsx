import React, { memo, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { theme } from "../constants/theme";
import { hp } from "../helpers/common";
import parsedCurrency from "../utils/currency";
import useLikeStore from "../store/useLikeStore";
import ArtDesign from "react-native-vector-icons/AntDesign";
import { useNavigation } from "@react-navigation/native";

const Product = memo(({ product }) => {
  const navigation = useNavigation();
  //const [isLiked, setIsLiked] = useState(false);
  const formattedPrice = parsedCurrency("currency", "VND", product.price);

  // const { addLikeItem, removeLikeItem } = useLikeStore((state) => ({
  //   addLikeItem: state.addLikeItem,
  //   removeLikeItem: state.removeLikeItem,
  // }));

  // const handleLikePress = () => {
  //   if (isLiked) {
  //     removeLikeItem(product);
  //   } else {
  //     addLikeItem(product);
  //   }
  //   setIsLiked(!isLiked);
  // };
  return (
    <TouchableOpacity
      onPress={() => navigation.navigate("productDetails", { productId: product._id })}
      style={styles.containerProduct}
    >
      <View>
        <Image source={{ uri: product.img }} style={styles.convertImage} />
        <View style={styles.content}>
          <Text style={styles.title}>{product.name}</Text>
          <Text style={styles.price}>{formattedPrice}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  title: {
    color: theme.colors.text,
    fontSize: hp(2),
    fontWeight: theme.fonts.semibold,
  },
  containerProduct: {
    flex: 1,
    marginTop: 10,
  },
  convertImage: {
    width: "90%",
    height: 200,
    borderRadius: 20,
    marginVertical: 5,
    marginLeft: 10,
    marginTop: 15,
    resizeMode: "cover",
  },

  price: {
    fontSize: 18,
    color: "#9C9C9C",
    fontWeight: theme.fonts.regular,
  },
  content: {
    paddingLeft: 15,
  },
  likeContainer: {
    position: "absolute",
    right: 10,
    top: 20,
    backgroundColor: "white",
    justifyContent: "center",
    height: 34,
    width: 34,
    alignItems: "center",
    borderRadius: 17,
  },
});

export default Product;