import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { SwipeListView } from "react-native-swipe-list-view";
import ScreenWrapper from "../../components/ScreenWrapper";
import { hp, wp } from "../../helpers/common";
import { theme } from "../../constants/theme";
import BackButton from "../../components/BackButton";
import { getValueFor } from "../../utils/secureStore";
import useSecureStore from "../../store/useSecureStore";
import { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";

const JoinedCampaigns = () => {
  const { userId, accessToken } = useSecureStore();
  const [campaigns, setCampaigns] = useState([]);
  const router = useRouter();
  const navigation = useNavigation();

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        // console.log("Access Token:", accessToken);
        // console.log("User ID:", userId);
        const response = await fetch(
          `${process.env.EXPO_PUBLIC_API_URL}/users/${userId}/campaigns`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        if (!response.ok) {
          const errorData = await response.json();
          console.error("Error fetching campaign data:", errorData);
          return;
        }
        const data = await response.json();
        // console.log("Response Data:", data);
        setCampaigns(data);
      } catch (error) {
        console.error("Error fetching campaign data:", error);
      }
    };

    fetchCampaigns();
  }, []);

  campaigns.forEach((campaign) => {
    console.log(campaign);
  });

  const handleLeaveCampaign = async (campaignId) => {
    try {
      const accessToken = await getValueFor("accessToken");
      const userId = await getValueFor("userId");
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/users/${userId}/campaigns/${campaignId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error leaving campaign:", errorData);
        return;
      }
      setCampaigns(campaigns.filter((campaign) => campaign._id !== campaignId));
    } catch (error) {
      console.error("Error leaving campaign:", error);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate("RecycleCampaignDetail", { id: item._id })}
    >
      <View style={styles.itemContainer}>
        <Image source={{ uri: item.img }} style={styles.itemImage} />
        {!item.status && (
          <View style={styles.closedOverlay}>
            <Text style={styles.closedText}>Closed</Text>
          </View>
        )}
        <View style={styles.itemDetails}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemLocation}>
            {Array.isArray(item.location) ? item.location.join(", ") : ""}
          </Text>
          <Text style={styles.itemDescription}>{item.description_content}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderHiddenItem = ({ item }) => (
    <View style={styles.rowBack}>
      <TouchableOpacity style={styles.leaveButton} onPress={() => handleLeaveCampaign(item._id)}>
        <Text style={styles.leaveButtonText}>Leave</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <ScreenWrapper bg={"white"}>
      <StatusBar style="dark" />
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <BackButton onPress={() => router.push("(tabs)/account")} />
            <Text style={[styles.logoText, { marginLeft: 30 }]}>Joined Campaigns</Text>
          </View>
        </View>
        <SwipeListView
          data={campaigns}
          renderItem={renderItem}
          renderHiddenItem={renderHiddenItem}
          keyExtractor={(item) => item._id}
          rightOpenValue={-75}
        />
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: wp(4),
  },
  closedOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  closedText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
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
  rowBack: {
    alignItems: "center",
    backgroundColor: "#DDD",
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingRight: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  leaveButton: {
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
    width: 75,
    height: "100%",
    borderRadius: 10,
  },
  leaveButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default JoinedCampaigns;
