import { StyleSheet, Text, View, Image, TouchableOpacity, FlatList, ImageBackground, auto } from "react-native";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { theme } from "../constants/theme";
import ProductCard from "../components/ProductCard";
import BackButton from "../components/BackButton";
const San_Pham = "San Pham";
const Gia = "Gia";
const userProfile = () => {
  const router = useRouter();
  const [selectedId, setSelectedId] = useState();
  const [follow, setfollow] = React.useState(false);
  const [page, setPage] = useState(San_Pham);
  const [isLiked, setIsLiked] = useState(false);
  const DATA = [];
  const ItemSeparator = () => <View style={styles.separator} />;
  const renderItem = ({ item }) => {
    const backgroundColor = item.id === selectedId ? "#04FFB8" : "#F4F6F8";
    const color = item.id === selectedId ? "white" : theme.colors.text;
    return (
      <Item item={item} onPress={() => setSelectedId(item.id)} backgroundColor={backgroundColor} textColor={color} />
    );
  };

  const Item = ({ item, onPress, backgroundColor, textColor }) => (
    <TouchableOpacity onPress={onPress} style={[styles.item, { backgroundColor }]}>
      <Text style={[styles.title, { color: textColor }]}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ImageBackground source={require("../assets/images/iconshop.webp")} style={styles.infomationshop}>
        {/* Lớp phủ để làm mờ hình nền */}
        <View style={styles.overlay} />
        <View style={styles.backinconshop}>
          <View>
            <BackButton router={router} />
          </View>
          <View style={styles.inconshop}>
            <Image source={require("../assets/images/iconshop.webp")} style={styles.convertImage} />
          </View>
        </View>
        <View style={styles.shopprofile}>
          <View style={styles.nameshop}>
            <Text style={styles.name}>Hải Nam Computers</Text>
          </View>
          <View style={styles.EvaluateContainer}>
            <Text style={styles.Diemtincay}>Điểm tin cậy:</Text>
            <Text style={styles.Evaluate}>9.9/10.0</Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => {
            setfollow(!follow);
          }}
          style={styles.follow}
        >
          {follow ? <Text style={styles.theodoi}>Theo dõi</Text> : <Text style={styles.theodoi}>Đang theo dõi</Text>}
        </TouchableOpacity>
      </ImageBackground>
      <View style={styles.productContainer}>
        <Text style={styles.product}>Sản Phẩm</Text>
      </View>
      <View style={styles.loc}>
        <TouchableOpacity
          style={{ width: "50%", height: "100%", justifyContent: "center", alignItems: "center" }}
          onPress={() => {
            setPage(San_Pham);
          }}
        >
          <Text style={styles.locsanpham}>Mới nhất</Text>
          {page === San_Pham ? (
            <View
              style={{
                position: "absolute",
                bottom: 0,
                height: 3,
                width: "100%",
                backgroundColor: theme.colors.primary,
              }}
            ></View>
          ) : null}
        </TouchableOpacity>
        <TouchableOpacity
          style={{ width: "50%", height: "100%", justifyContent: "center", alignItems: "center" }}
          onPress={() => {
            setPage(Gia);
          }}
        >
          <Text style={styles.locsanpham1}>Giá</Text>
          {page === Gia ? (
            <View
              style={{
                position: "absolute",
                bottom: 0,
                height: 3,
                width: "100%",
                backgroundColor: theme.colors.primary,
              }}
            ></View>
          ) : null}
        </TouchableOpacity>
      </View>
      <FlatList
        numColumns={2}
        ListHeaderComponent={
          <>
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
        data={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]}
        renderItem={({ item, index }) => <ProductCard item={item} isLiked={isLiked} setIsLiked={setIsLiked} />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 300 }}
      />
    </View>
  );
};
export default userProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 10,
  },
  infomationshop: {
    flexDirection: "row",
    width: "100%",
    height: 150,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject, // Giúp lớp phủ bao phủ toàn bộ ImageBackground
    backgroundColor: "rgba(255, 255, 255, 0.5)", // Màu trắng với độ mờ 50% để làm nhạt hình ảnh
  },
  convertImage: {
    width: 60,
    height: 60,
    borderRadius: 50,
  },

  shopprofile: {
    flexDirection: "column",
    width: "50%",
    height: 100,
    top: 50,
    left: 11,
  },
  backinconshop: {
    flexDirection: "column",
    width: 60,
    height: 150,
    top: 25,
    left: 10,
  },
  inconshop: {
    width: 60,
    height: 60,
    borderRadius: 50,
    top: 20,
  },
  nameshop: {
    width: auto,
    height: "70%",
    top: 30,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
  },

  EvaluateContainer: {
    flexDirection: "row",
    width: auto,
    height: "30%",
    top: 7,
  },
  Evaluate: {
    fontSize: 12,
  },
  Diemtincay: {
    fontSize: 12,
  },
  follow: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: theme.colors.primary,
    color: theme.colors.primary,
    justifyContent: "center",
    height: 34,
    width: 100,
    alignItems: "center",
    borderRadius: 20,
    top: 77,
    right: 10,
  },
  productContainer: {
    width: "100%",
    height: 30,
  },
  product: {
    padding: 2,
    fontSize: 20,
  },
  loc: {
    width: "100%",
    height: 30,
    flexDirection: "row",
  },
  locsanpham: {
    fontSize: 20,
    alignItems: "center",
    justifyContent: "center",
    color: theme.colors.primary,
  },
  locsanpham1: {
    fontSize: 20,
    alignItems: "center",
    justifyContent: "center",
    color: theme.colors.primary,
  },
});
