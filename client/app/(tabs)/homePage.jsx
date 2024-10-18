import { View, Image, Text, StyleSheet, StatusBar, Pressable, FlatList, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import ScreenWrapper from "../../components/ScreenWrapper";
import { hp, wp } from "../../helpers/common";
import { theme } from "../../constants/theme";
import Icon from "../../assets/icons";
import Search from "../../components/Search";
import ArtDesign from "react-native-vector-icons/AntDesign";
import Carousel from "../../components/Carousel";
import { router } from "expo-router";
import { useNavigation } from "@react-navigation/native";
import Loading from "../../components/Loading";

const homePage = () => {
  const [selectedId, setSelectedId] = useState();
  const nameRef = React.useRef("");
  // useEffect(() => {
  //     const fetchProducts = async () => {
  //         const accessToken = await getValueFor('accessToken');
  //         console.log(accessToken);

  //         const response = await fetch('https://patient-mosquito-infinitely.ngrok-free.app/', {
  //             method: 'GET',
  //             headers: {
  //                 contentType: 'application/json',
  //                 authorization: `Bearer ${accessToken}`
  //             },
  //         });
  //         const data = await response.json();
  //         console.log(data.products);
  //         return data;
  //     }
  //     fetchProducts()
  // }, [])

  const DATA = [
    {
      id: "1",
      title: "All",
    },
    {
      id: "2",
      title: "Second Item",
    },
    {
      id: "3",
      title: "Third Item",
    },
    {
      id: "4",
      title: "Third Item",
    },
    {
      id: "5",
      title: "Third Item",
    },
    {
      id: "6",
      title: "Third Item",
    },
  ];
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const [products, setProducts] = useState([]);
  useEffect(() => {
    // Fetch product data
    fetch("https://fakestoreapi.com/products")
      .then((response) => response.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <Loading />;
  }

  const ProductCard = ({ item, isLiked, setIsLiked }) => {
    const formattedPrice = new Intl.NumberFormat("vi-VI", {
      style: "currency",
      currency: "VND",
    }).format(item.price * 1000);
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate("productDetails", { product: item })}
        style={styles.containerProduct}
      >
        <View>
          <Image source={{ uri: item.image }} style={styles.convertImage} />
          <View style={styles.content}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.price}>{formattedPrice}</Text>
          </View>

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
      </TouchableOpacity>
    );
  };

  const Item = ({ item, onPress, backgroundColor, textColor }) => (
    <TouchableOpacity onPress={onPress} style={[styles.item, { backgroundColor }]}>
      <Text style={[styles.title, { color: textColor }]}>{item.title}</Text>
    </TouchableOpacity>
  );
  const ItemSeparator = () => <View style={styles.separator} />;
  const renderItem = ({ item }) => {
    const backgroundColor = item.id === selectedId ? "#04FFB8" : "#F4F6F8";
    const color = item.id === selectedId ? "white" : theme.colors.text;
    return (
      <Item item={item} onPress={() => setSelectedId(item.id)} backgroundColor={backgroundColor} textColor={color} />
    );
  };

  return (
    <ScreenWrapper bg={"white"}>
      <StatusBar style="dark" />
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.logoText}>Eco Trade</Text>
          <View style={styles.icons}>
            <Pressable onPress={() => router.push("cart")}>
              <Icon name={"cart"} size={hp(3.2)} strokeWidth={2} color={theme.colors.text} />
            </Pressable>
            <Pressable>
              <Icon name={"heart"} size={hp(3.2)} strokeWidth={2} color={theme.colors.text} />
            </Pressable>
          </View>
        </View>
        {/* Search */}
        <View style={styles.row}>
          <Search
            icon={<Icon name="search" size={26} strokeWidth={1.6} />}
            placeholder="Search products, brands..."
            onChangeText={(value) => (nameRef.current = value)}
          />

          <Icon name="filter" size={hp(3.2)} strokeWidth={2} color={theme.colors.text} />
        </View>
        {/* Carousel */}
        {/* <View>
                    <SafeAreaView>
                        <Carousel />
                    </SafeAreaView>
                </View> */}

        {/* Products */}
        <FlatList
          numColumns={2}
          data={products}
          renderItem={ProductCard}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 300 }}
          ListHeaderComponent={
            <>
              {/* Categories */}
              <View>
                <FlatList
                  data={DATA}
                  renderItem={renderItem}
                  keyExtractor={(item) => item.id}
                  extraData={selectedId}
                  horizontal={true}
                  ItemSeparatorComponent={ItemSeparator}
                  showsHorizontalScrollIndicator={false}
                />
              </View>
            </>
          }
        />
      </View>
    </ScreenWrapper>
  );
};

export default homePage;

const styles = StyleSheet.create({
  container: {
    //flex: 1,
    paddingHorizontal: wp(4),
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 50,
    marginHorizontal: wp(4),
    paddingTop: hp(2),
  },
  logoText: {
    fontSize: hp(3),
    fontWeight: theme.fonts.bold,
    color: theme.colors.text,
  },
  icons: {
    flexDirection: "row",
    gap: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 20,
  },
  item: {
    height: hp(8),
    width: wp(27),
    justifyContent: "center",
    alignItems: "center",
    borderCurve: "continuous",
    borderRadius: theme.radius.xl,
  },
  title: {
    color: theme.colors.text,
    fontSize: hp(2),
    fontWeight: theme.fonts.semibold,
  },
  separator: {
    marginLeft: 7,
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

// import {
//   View,
//   Text,
//   StyleSheet,
//   StatusBar,
//   Pressable,
//   FlatList,
//   TouchableOpacity,
// } from "react-native";
// import React, { useEffect, useState } from "react";
// import ScreenWrapper from "../../components/ScreenWrapper";
// import { hp, wp } from "../../helpers/common";
// import { theme } from "../../constants/theme";
// import Icon from "../../assets/icons";
// import Search from "../../components/Search";
// import Carousel from "../../components/Carousel";
// import ProductCard from "../../components/ProductCard";
// import { getValueFor } from "../../utils/secureStore";

// const homePage = () => {
//   const [selectedId, setSelectedId] = useState();
//   const nameRef = React.useRef("");
//   const [isLiked, setIsLiked] = useState(false);
//   useEffect(() => {
//     const fetchProducts = async () => {
//       const accessToken = await getValueFor("accessToken");
//       const response = await fetch(process.env.EXPO_PUBLIC_API_URL, {
//         method: "GET",
//         headers: {
//           authorization: `Bearer ${accessToken}`,
//         },
//       });
//       const data = await response.json();
//       console.log(data.products);
//       console.log(accessToken);
//     };
//     fetchProducts();
//   }, []);
//   const DATA = [
//     {
//       id: "1",
//       title: "All",
//     },
//     {
//       id: "2",
//       title: "Second Item",
//     },
//     {
//       id: "3",
//       title: "Third Item",
//     },
//     {
//       id: "4",
//       title: "Third Item",
//     },
//     {
//       id: "5",
//       title: "Third Item",
//     },
//     {
//       id: "6",
//       title: "Third Item",
//     },
//   ];

//   const Item = ({ item, onPress, backgroundColor, textColor }) => (
//     <TouchableOpacity
//       onPress={onPress}
//       style={[styles.item, { backgroundColor }]}
//     >
//       <Text style={[styles.title, { color: textColor }]}>{item.title}</Text>
//     </TouchableOpacity>
//   );
//   const ItemSeparator = () => <View style={styles.separator} />;
//   const renderItem = ({ item }) => {
//     const backgroundColor = item.id === selectedId ? "#04FFB8" : "#F4F6F8";
//     const color = item.id === selectedId ? "white" : theme.colors.text;
//     return (
//       <Item
//         item={item}
//         onPress={() => setSelectedId(item.id)}
//         backgroundColor={backgroundColor}
//         textColor={color}
//       />
//     );
//   };
//   return (
//     <ScreenWrapper bg={"white"}>
//       <StatusBar style="dark" />
//       <View style={styles.container}>
//         {/* Header */}
//         <View style={styles.header}>
//           <Text style={styles.logoText}>Eco Trade</Text>
//           <View style={styles.icons}>
//             <Pressable>
//               <Icon
//                 name={"cart"}
//                 size={hp(3.2)}
//                 strokeWidth={2}
//                 color={theme.colors.text}
//               />
//             </Pressable>
//             <Pressable>
//               <Icon
//                 name={"heart"}
//                 size={hp(3.2)}
//                 strokeWidth={2}
//                 color={theme.colors.text}
//               />
//             </Pressable>
//           </View>
//         </View>
//         {/* Search */}
//         <View style={styles.row}>
//           <Search
//             icon={<Icon name="search" size={26} strokeWidth={1.6} />}
//             placeholder="Search products, brands..."
//             onChangeText={(value) => (nameRef.current = value)}
//           />

//           <Icon
//             name="filter"
//             size={hp(3.2)}
//             strokeWidth={2}
//             color={theme.colors.text}
//           />
//         </View>
//         {/* Categories */}

//         {/* Carousel */}
//         {/* <View>
//                     <SafeAreaView>
//                         <Carousel />
//                     </SafeAreaView>
//                 </View> */}

//         {/* Products */}
//         <FlatList
//           numColumns={2}
//           ListHeaderComponent={
//             <>
//               <View>
//                 <FlatList
//                   data={DATA}
//                   renderItem={renderItem}
//                   keyExtractor={(item) => item.id}
//                   extraData={selectedId}
//                   horizontal={true}
//                   ItemSeparatorComponent={ItemSeparator}
//                   showsHorizontalScrollIndicator={false}
//                 />
//               </View>
//             </>
//           }
//           data={[1, 2, 3, 4, 5, 6, 7, 8]}
//           renderItem={({ item, index }) => (
//             <ProductCard
//               item={item}
//               isLiked={isLiked}
//               setIsLiked={setIsLiked}
//             />
//           )}
//           showsVerticalScrollIndicator={false}
//           contentContainerStyle={{ paddingBottom: 300 }}
//         />
//         <View style={{ flexDirection: "row" }}>
//           <ProductCard />
//           <ProductCard />
//         </View>

//         {/* Footer */}
//       </View>
//     </ScreenWrapper>
//   );
// };

// export default homePage;

// const styles = StyleSheet.create({
//   container: {
//     //flex: 1,
//     paddingHorizontal: wp(4),
//   },
//   header: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 50,
//     marginHorizontal: wp(4),
//     paddingTop: hp(2),
//   },
//   logoText: {
//     fontSize: hp(3),
//     fontWeight: theme.fonts.bold,
//     color: theme.colors.text,
//   },
//   icons: {
//     flexDirection: "row",
//     gap: 18,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   row: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     paddingBottom: 20,
//   },
//   item: {
//     height: hp(8),
//     width: wp(27),
//     justifyContent: "center",
//     alignItems: "center",
//     borderCurve: "continuous",
//     borderRadius: theme.radius.xl,
//   },
//   title: {
//     color: theme.colors.text,
//     fontSize: hp(2),
//     fontWeight: theme.fonts.semibold,
//   },
//   separator: {
//     marginLeft: 7,
//   },
// });
