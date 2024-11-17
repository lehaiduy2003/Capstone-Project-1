import {
  Image,
  StatusBar,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  auto,
} from "react-native";
import React, { useEffect, useState } from "react";
import ScreenWrapper from "../components/ScreenWrapper";
import Button from "../components/Button";
import { wp } from "../helpers/common";
import ArtDesign from "react-native-vector-icons/AntDesign";
import { useRoute } from "@react-navigation/native";
import Header from "../components/Header";
import { useRouter } from "expo-router";
import useCartStore from "../store/useCartStore";

const ProductDetails = () => {
  const route = useRoute();
  const router = useRouter();
  const [isLiked, setIsLiked] = React.useState(false);
  const { productId } = route.params;
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState({});
  const [owner, setOwner] = useState({});

  const fetchProductData = async () => {
    try {
      const productResponse = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/products/${productId}`
      );
      const productData = await productResponse.json();

      const ownerResponse = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/users/${productData.owner}`
      );
      const ownerData = await ownerResponse.json();

      setProduct(productData);
      setOwner(ownerData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    fetchProductData();
  }, [productId]);

  const increaseQuantity = () => setQuantity(quantity + 1);
  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handleAddToCart = () => {
    // console.log("Product to add:", productToAdd);

    useCartStore.getState().addProduct(product._id, quantity);
    // router.push("/Screens/cartScreen"); // Optionally navigate to the Cart scree
  };
  return (
    <ScreenWrapper bg={"white"}>
      <StatusBar style="dark" />
      <ScrollView style={styles.container}>
        <Header title={"Product Detail"} showBackButton></Header>
        <View style={styles.carousel}>
          <Image source={{ uri: product.img }} style={styles.productImage} />
        </View>
        <View>
          <Text style={styles.nameProduct}>{product.name}</Text>
        </View>
        <View style={styles.priceLikeContainer}>
          <Text style={styles.price}>{product.price} đ</Text>
          <TouchableOpacity
            onPress={() => {
              setIsLiked(!isLiked);
            }}
            style={styles.likeContainer}
          >
            {isLiked ? (
              <ArtDesign name="heart" size={20} color={"#E55B5B"} />
            ) : (
              <ArtDesign name="hearto" size={20} color={"#E55B5B"} />
            )}
          </TouchableOpacity>
        </View>
        <View style={styles.quantityContainer}>
          <TouchableOpacity onPress={decreaseQuantity} style={styles.quantityButton}>
            <Text style={styles.quantityButtonText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.quantityText}>{quantity}</Text>
          <TouchableOpacity onPress={increaseQuantity} style={styles.quantityButton}>
            <Text style={styles.quantityButtonText}>+</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.information}>
          <Image source={{ uri: owner.avatar }} style={styles.convertImage} />
          <Text style={styles.nameShop}>{owner.name}</Text>
          <View style={styles.follow}>
            <Button
              title="Follow"
              onPress={() => {
                router.push(`/Screens/shopScreen/${owner.id}`);
              }}
            />
          </View>
        </View>
        <View>
          <Text style={styles.description}>Description:</Text>
          <Text style={styles.contentDescription}>{product.description_content}</Text>
        </View>
      </ScrollView>
      <Button title="Add to cart" onPress={handleAddToCart}></Button>
    </ScreenWrapper>
  );
};

export default ProductDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: wp(2),
  },

  carousel: {
    width: "100%",
    height: auto,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },

  nameProduct: {
    justifyContent: "center",
    fontSize: 20,
    fontWeight: "bold",
    marginHorizontal: 15,
  },

  priceLikeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 5,
  },
  price: {
    fontSize: 18,
    color: "#9C9C9C",
    fontWeight: "bold",
    marginLeft: 10,
  },
  likeContainer: {
    backgroundColor: "white",
    justifyContent: "center",
    height: 34,
    width: 34,
    alignItems: "center",
    borderRadius: 20,
    marginRight: 10,
  },

  information: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 5,
    alignItems: "center",
  },
  convertImage: {
    width: 50,
    height: 50,
    borderRadius: 20,
    marginVertical: 3,
    marginLeft: 5,
    marginTop: 5,
  },
  nameShop: {
    padding: 10,
    fontSize: 15,
    fontWeight: "bold",
    right: 15,
    top: -10,
  },

  follow: {
    backgroundColor: "white",
    justifyContent: "center",
    height: 34,
    width: 150,
    borderRadius: 2,
    marginRight: 10,
  },

  description: {
    paddingTop: 10,
    marginHorizontal: 15,
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 10,
  },

  contentDescription: {
    padding: 10,
    fontStyle: "italic",
    fontSize: 17,
    justifyContent: "center",
    marginHorizontal: 5,
    paddingBottom: 200,
  },
  productImage: {
    width: "100%",
    height: 300,
    resizeMode: "contain",
    marginBottom: 20,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  ratingText: {
    fontSize: 14,
    marginRight: 5,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    justifyContent: "center",
  },
  quantityButton: {
    backgroundColor: "#000",
    padding: 10,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  quantityButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  quantityText: {
    fontSize: 16,
    marginHorizontal: 10,
    fontWeight: "bold",
  },
});
