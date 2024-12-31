import {
  FlatList,
  Image,
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import Search from "../../components/Search";
import Icon from "../../assets/icons";
import ScreenWrapper from "../../components/ScreenWrapper";
import { useRouter } from "expo-router";
import { hp, wp } from "../../helpers/common";
import { theme } from "../../constants/theme";
import { useInfiniteQuery } from "@tanstack/react-query";

const Post = () => {
  const router = useRouter();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const fetchPosts = async ({ pageParam = 0 }) => {
    setLoading(true);
    const response = await fetch(
      `${process.env.EXPO_PUBLIC_API_URL}/posts?skip=${pageParam}&limit=30&sort=updated_at&order=desc`
    );

    if (!response.ok) {
      const errorData = await response.json();
      setLoading(false);
      throw new Error(errorData.message || "Failed to fetch posts");
    }

    const data = await response.json();
    // console.log("Fetched posts:", data);

    setLoading(false);
    return data.data;
  };

  const {
    data,
    isLoading: queryLoading,
    fetchNextPage,
    hasNextPage,
    error,
  } = useInfiniteQuery({
    queryKey: ["posts"],
    queryFn: ({ pageParam = 0 }) => fetchPosts({ pageParam }),
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.length === 0) return undefined;
      return pages.length * 30;
    },
  });

  useEffect(() => {
    // console.log("data", data.pages);

    setPosts(data ? data.pages.flat() : []);
  }, [data]);

  // console.log("posts", posts);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      key={item._id}
      style={styles.itemContainer}
      onPress={() => router.push(`/PostDetail?id=${item._id}`)}
    >
      <Image source={{ uri: item.description_imgs[0] }} style={styles.itemImage} />
      <View style={styles.itemDetails}>
        <Text style={styles.itemName}>{item.title}</Text>
        <Text style={styles.itemDescription}>{item.description_content}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScreenWrapper bg={"white"}>
      <StatusBar style="dark" />
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.logoText}>Eco Trade</Text>
          <View style={styles.icons}>
            <Pressable onPress={() => router.push("Screens/cartScreen")}>
              <Icon name={"cart"} size={hp(3.2)} strokeWidth={2} color={theme.colors.text} />
            </Pressable>
            <Pressable>
              <Icon name={"heart"} size={hp(3.2)} strokeWidth={2} color={theme.colors.text} />
            </Pressable>
          </View>
        </View>
        {/* Search */}
        <View style={styles.searchContainer}>
          <Search
            icon={<Icon name="search" size={26} strokeWidth={1.6} />}
            placeholder="Search post"
            onChangeText={(value) => (nameRef.current = value)}
            searchType="posts"
          />
        </View>

        {/**posts list */}
        <FlatList
          data={posts}
          contentContainerStyle={{ paddingBottom: 80 }}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
          onEndReached={() => {
            if (hasNextPage) {
              fetchNextPage();
            }
          }}
        />
        {/* Add New posts Button */}
        <TouchableOpacity style={styles.addNewPostButton} onPress={() => router.push("AddNewPost")}>
          <Icon name="plus" size={hp(4)} strokeWidth={2} color="white" />
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  );
};

export default Post;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: wp(4),
  },
  itemImage: {
    width: 80,
    height: 80,
    marginRight: 16,
    borderRadius: 8,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  itemDescription: {
    fontSize: 14,
    color: "gray",
  },
  itemContainer: {
    flexDirection: "row",
    padding: 10,
    backgroundColor: "white",
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  addNewPostButton: {
    position: "absolute",
    bottom: hp(10),
    right: wp(5),
    backgroundColor: theme.colors.primary,
    borderRadius: hp(5),
    width: hp(8),
    height: hp(8),
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
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
  searchContainer: {
    flexDirection: "column",
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
  typeList: {
    paddingHorizontal: hp(2),
    paddingVertical: hp(1),
  },
  typeButton: {
    marginRight: hp(1),
    padding: hp(1),
    backgroundColor: theme.colors.primary,
    borderRadius: hp(1),
  },
  typeText: {
    color: "white",
    fontSize: hp(2),
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
