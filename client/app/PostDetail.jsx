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
const PostDetail = () => {
  const navigator = useNavigation();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isLiked, setIsLiked] = React.useState(false);
  const { id } = useLocalSearchParams();
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState({});
  const [owner, setOwner] = useState({});
  const [carouselImages, setCarouselImages] = useState([]);

  const fetchProductData = async () => {
    try {
      console.log("Product ID:", id); //Find the product ID

      const productResponse = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/posts/${id}`);
      // console.log("Product ID:", productId); //Find the product ID
      const productData = await productResponse.json();
      console.log("Product Data:", productData.data);
      const ownerResponse = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/users/${productData.data.author_id}`
      );
      const ownerData = await ownerResponse.json();

      setProduct(productData.data);
      setOwner(ownerData);
      // Dynamically add product and additional images
      const images = [...(productData.data.description_imgs || [])];
      setCarouselImages(images);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchProductData();
  }, [id]);

  const navigateToShopScreen = () => {
    router.push({
      pathname: `/Screens/shopScreen`,
      params: { ownerId: product.author_id }, // Pass owner ID
    });
  };

  return (
    <ScreenWrapper bg={"white"}>
      <StatusBar style="dark" />
      <ScrollView style={styles.container}>
        <Header
          title={"Post Detail"}
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
          <Text style={styles.nameProduct}>{product.title}</Text>
        </View>

        <View style={styles.imageGallery}>
          {product.description_imgs && Array.isArray(product.description_imgs) ? (
            product.description_imgs.map((imgUrl, index) => (
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
      <TouchableOpacity style={styles.addCartButton}>
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
            Contact
          </Text>
        )}
      </TouchableOpacity>
    </ScreenWrapper>
  );
};

export default PostDetail;

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
