// import React from "react";
// import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from "react-native";
// import useLikeStore from "../../store/useLikeStore";
// import { useNavigation } from "@react-navigation/native";

// const SavedScreen = () => {
//   const { likeItems } = useLikeStore((state) => ({ likeItems: state.likeItems || [] }));
//   const navigation = useNavigation();

//   return (
//     <View style={styles.container}>
//       {likeItems.length === 0 ? (
//         <Text style={styles.emptyText}>No products saved yet.</Text>
//       ) : (
//         <FlatList
//           data={likeItems}
//           keyExtractor={(item) => item.id.toString()}
//           renderItem={({ item }) => (
//             <TouchableOpacity
//               onPress={() => navigation.navigate("productDetails", { productId: item._id })}
//               style={styles.productContainer}
//             >
//               <Image source={{ uri: item.img }} style={styles.productImage} />
//               <View style={styles.productInfo}>
//                 <Text style={styles.productName}>{item.name}</Text>
//                 <Text style={styles.productPrice}>{item.price}</Text>
//               </View>
//             </TouchableOpacity>
//           )}
//         />
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 16,
//     backgroundColor: "#fff",
//   },
//   emptyText: {
//     textAlign: "center",
//     fontSize: 18,
//     color: "#9C9C9C",
//     marginTop: 20,
//   },
//   productContainer: {
//     flexDirection: "row",
//     marginBottom: 16,
//     backgroundColor: "#f8f8f8",
//     borderRadius: 8,
//     padding: 10,
//   },
//   productImage: {
//     width: 60,
//     height: 60,
//     borderRadius: 8,
//   },
//   productInfo: {
//     marginLeft: 16,
//     justifyContent: "center",
//   },
//   productName: {
//     fontSize: 16,
//     fontWeight: "bold",
//   },
//   productPrice: {
//     fontSize: 14,
//     color: "#9C9C9C",
//   },
// });

// export default SavedScreen;
