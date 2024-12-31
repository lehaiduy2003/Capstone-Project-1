import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  Alert,
  Pressable,
  Platform,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import ScreenWrapper from "../../components/ScreenWrapper";
import HeadScreen from "../../components/HomePage/HeadScreen";
import ProductCard from "../../components/ProductCard";
import Category from "../../components/RecyclePage/Category";
import { getValueFor } from "../../utils/secureStore";
import usePagination from "../../hooks/usePagination";
import { hp, wp } from "../../helpers/common";
import { theme } from "../../constants/theme";
import Icon from "../../assets/icons";
import Search from "../../components/Search";
import { SafeAreaView } from "react-native-safe-area-context";
// import BackButton from "../../components/BackButton";
import { useInfiniteQuery } from "@tanstack/react-query";
import useLoadingStore from "../../store/useLoadingStore";

const DonateRecycle = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [campaigns, setCampaigns] = useState([]);
  const { isLoading, setLoading } = useLoadingStore();

  const fetchCampaigns = async ({ pageParam = 0, query = "" }) => {
    setLoading(true);
    const response = await fetch(
      `${process.env.EXPO_PUBLIC_API_URL}/campaigns/search?query=${query}&skip=${pageParam}&limit=30`
    );

    if (!response.ok) {
      const errorData = await response.json();
      setLoading(false);
      throw new Error(errorData.message || "Failed to fetch campaigns");
    }

    const data = await response.json();
    setLoading(false);
    return data;
  };

  const {
    data,
    isLoading: queryLoading,
    fetchNextPage,
    hasNextPage,
    error,
  } = useInfiniteQuery({
    queryKey: ["campaigns", searchTerm],
    queryFn: ({ pageParam = 0 }) => fetchCampaigns({ pageParam, query: searchTerm }),
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.length === 0) return undefined;
      return pages.length * 30;
    },
  });

  useEffect(() => {
    setCampaigns(data ? data.pages.flat() : []);
  }, [data]);

  const renderItem = ({ item, index }) => (
    <TouchableOpacity
      key={item._id || index}
      style={styles.itemContainer}
      onPress={() => router.push(`/CampaignDetail?id=${item._id}`)}
    >
      <Image source={{ uri: item.img }} style={styles.itemImage} />
      <View style={styles.itemDetails}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemLocation}>
          {Array.isArray(item.location) ? item.location.join(", ") : ""}
        </Text>
        <Text style={styles.itemDescription}>{item.description_content}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScreenWrapper bg={"white"}>
      <StatusBar style="dark" />
      <View style={styles.container}>
        <View style={styles.header}>
          {/* <BackButton router={router} /> */}
          <Text style={styles.logoText}>Campaign</Text>
          <View style={styles.icons}>
            <Pressable>
              <Icon name={"heart"} size={hp(3.2)} strokeWidth={2} color={theme.colors.text} />
            </Pressable>
          </View>
        </View>
        {/* Search */}
        <View style={styles.row}>
          <Search
            icon={<Icon name="search" size={26} strokeWidth={1.6} />}
            placeholder="Search for recycle..."
            onChangeText={(value) => setSearchTerm(value)}
          />
          {/* <Icon name="filter" size={hp(3.2)} strokeWidth={2} color={theme.colors.text} /> */}
        </View>
        {/* Category */}
        <View style={styles.categoryContainer}>
          <TouchableOpacity style={styles.categoryButton}>
            <Text style={styles.categoryText}>All</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.categoryButton}>
            <Text style={styles.categoryText}>Bottles</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.categoryButton}>
            <Text style={styles.categoryText}>Paper</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.categoryButton}>
            <Text style={styles.categoryText}>Shoes</Text>
          </TouchableOpacity>
        </View>
        {/* Recycle Items List */}
        <FlatList
          data={campaigns}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 80 }}
          keyExtractor={(item, index) => item._id || index.toString()}
          onEndReached={() => {
            if (hasNextPage) {
              fetchNextPage();
            }
          }}
        />
        {/* Add New Campaign Button */}
        {/* <TouchableOpacity
          style={styles.addNewCampaignButton}
          onPress={() => router.push("AddNewCampaign")}
        >
          <Icon name="plus" size={hp(4)} strokeWidth={2} color="white" />
        </TouchableOpacity> */}
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: wp(4),
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  logoText: {
    fontSize: hp(3.6),
    fontWeight: theme.fonts.bold,
    color: theme.colors.text,
  },
  icons: {
    flexDirection: "row",
  },
  row: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 20,
  },
  categoryContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  categoryButton: {
    padding: 10,
    backgroundColor: theme.colors.primary,
    borderRadius: 5,
  },
  categoryText: {
    color: "white",
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
  itemLocation: {
    fontSize: 14,
    color: "gray",
    marginBottom: 4,
  },
  itemDescription: {
    fontSize: 14,
    color: "gray",
  },
  addNewCampaignButton: {
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
});

export default DonateRecycle;
