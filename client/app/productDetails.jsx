import {
  Image,
  StatusBar,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import ScreenWrapper from "../components/ScreenWrapper";
import Button from "../components/Button";
import { hp, wp } from "../helpers/common";
import ArtDesign from "react-native-vector-icons/AntDesign";
import { useRoute } from "@react-navigation/native";
import Header from "../components/Header";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import useCartStore from "../store/useCartStore";
import { theme } from "../constants/theme";
import CustomCarousel from "../components/Carousel";
import parsedCurrency from "../utils/currency";
const ProductDetails = () => {
  const route = useRoute();
  const navigator = useNavigation();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isLiked, setIsLiked] = React.useState(false);
  const { productId } = useLocalSearchParams();
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState({});
  const [owner, setOwner] = useState({});
  const [carouselImages, setCarouselImages] = useState([]);

  const fetchProductData = async () => {
    try {
      const productResponse = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/products/${productId}`
      );
      // console.log("Product ID:", productId); //Find the product ID
      const productData = await productResponse.json();

      const ownerResponse = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/users/${productData.owner}`
      );
      const ownerData = await ownerResponse.json();

      setProduct(productData);
      setOwner(ownerData);
      // Dynamically add product and additional images
      const images = [
        ...(productData.img ? [productData.img] : []),
        ...(productData.description_imgs || []),
      ];
      setCarouselImages(images);
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

  const handleAddToCart = async () => {
    try {
      setLoading(true);
      await useCartStore.getState().addProduct(product._id, quantity);
      Alert.alert("Success", "Product added to cart");
    } catch (error) {
      Alert.alert("Error", "Failed to add product to cart");
      console.error("Error adding product to cart:", error);
    } finally {
      setLoading(false);
    }
  };

  const navigateToShopScreen = () => {
    router.push({
      pathname: `/Screens/shopScreen`,
      params: { ownerId: product.owner }, // Pass owner ID
    });
  };

  return (
    <ScreenWrapper bg={"white"}>
      <StatusBar style="dark" />
      <ScrollView style={styles.container}>
        <Header
          title={"Product Detail"}
          showBackButton={true}
          backButtonPress={() => navigator.goBack()}
        />

        {/* <View style={styles.carousel}>
          <Image
            source={
              product.img
                ? { uri: product.img }
                : require("../assets/images/products/defaultProduct.png")
            }
            style={styles.productImage}
          />
        </View> */}

        {/* Custom Carousel */}
        <View style={styles.carouselContainer}>
          <CustomCarousel images={carouselImages} height={300} />
        </View>

        <View>
          <Text style={styles.nameProduct}>{product.name}</Text>
        </View>

        <View style={styles.priceLikeContainer}>
          <Text style={styles.price}>{parsedCurrency("currency", "VND", product.price)}</Text>
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

        <View style={styles.imageGallery}>
          {product.description?.imgs && Array.isArray(product.description.imgs) ? (
            product.description.imgs.map((imgUrl, index) => (
              <Image key={index} source={{ uri: imgUrl }} style={styles.additionalImage} />
            ))
          ) : (
            <Text style={styles.noImagesText}>No additional images available</Text>
          )}
        </View>

        <View style={styles.information}>
          <Image source={{ uri: owner.avatar }} style={styles.convertImage} />
          <Text style={styles.nameShop}>{owner.name}</Text>
          <View style={styles.follow}>
            <Button title="View" onPress={navigateToShopScreen} />
          </View>
        </View>

        <View>
          <Text style={styles.description}>Description:</Text>
          <Text style={styles.contentDescription}>{product.description_content}</Text>
        </View>
      </ScrollView>
      <TouchableOpacity onPress={handleAddToCart} style={styles.addCartButton}>
        {loading ? (
          <ActivityIndicator size="large" color={"white"} />
        ) : (
          <Text
            style={{
              color: "white",
              fontSize: 25,
              fontWeight: "bold",
            }}
          >
            Add to cart
          </Text>
        )}
      </TouchableOpacity>
    </ScreenWrapper>
  );
};

export default ProductDetails;

const styles = StyleSheet.create({
  addCartButton: {
    backgroundColor: theme.colors.primary,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    height: hp(6.6),
    marginHorizontal: 15,
    marginBottom: 15,
    paddingHorizontal: 20,
    width: "90%",
    borderCurve: "continuous",
    borderRadius: theme.radius.xxl,
  },
  container: {
    flex: 1,
    paddingHorizontal: wp(2),
  },
  // carousel: {
  //   width: "100%",
  //   height: 300,
  //   alignItems: "center",
  //   justifyContent: "center",
  //   borderRadius: 10,
  //   marginBottom: 10,
  // },
  carouselContainer: {
    marginVertical: 10,
  },
  carouselImage: {
    width: "90%",
    height: 300,
    borderRadius: 10,
    resizeMode: "cover",
  },
  productImage: {
    width: "100%",
    height: 300,
    resizeMode: "contain",
  },
  nameProduct: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
  },
  priceLikeContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  price: {
    fontSize: 18,
    color: "#333",
  },
  likeContainer: {
    marginRight: 10,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 15,
  },
  quantityButton: {
    padding: 10,
  },
  quantityButtonText: {
    fontSize: 16,
  },
  quantityText: {
    fontSize: 16,
    marginHorizontal: 10,
  },
  imageGallery: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginVertical: 10,
  },
  additionalImage: {
    width: 100,
    height: 100,
    margin: 5,
  },
  noImagesText: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
  },
  information: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  convertImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  nameShop: {
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
  follow: {
    marginLeft: "auto",
  },
  description: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 15,
  },
  contentDescription: {
    fontSize: 14,
    marginTop: 5,
  },
});
