import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import ScreenWrapper from "../components/ScreenWrapper";
import { hp, wp } from "../helpers/common";
import { theme } from "../constants/theme";
import { getValueFor } from "../utils/secureStore";
import BackButton from "../components/BackButton";

const CampaignDetail = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCampaignDetail = async () => {
      try {
        const accessToken = await getValueFor("accessToken");
        const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/campaigns/${id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch campaign details");
        }

        const data = await response.json();
        setCampaign(data);
      } catch (error) {
        console.error("Error fetching campaign details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaignDetail();
  }, [id]);

  const handleJoinCampaign = async () => {
    try {
      const accessToken = await getValueFor("accessToken");
      const userId = await getValueFor("userId");
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/users/${userId}/campaigns/${id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        Alert.alert("Join Success", "You have successfully joined the campaign.");
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to join campaign");
      }
    } catch (error) {
      console.error("Error joining campaign:", error);
      Alert.alert("Error", error.message);
    }
  };

  if (loading) {
    return (
      <ScreenWrapper bg={"white"}>
        <StatusBar style="dark" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      </ScreenWrapper>
    );
  }

  if (!campaign) {
    return (
      <ScreenWrapper bg={"white"}>
        <StatusBar style="dark" />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Failed to load campaign details.</Text>
        </View>
      </ScreenWrapper>
    );
  }

  // const handleBackPress = () => {
  //   router.push("/DonateRecycle");
  // };

  return (
    <ScreenWrapper>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <BackButton onPress={() => router.push("/DonateRecycle")} />
        <Text style={styles.title}>{campaign.name}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {/* <Text style={styles.title}>{campaign.name}</Text> */}
        <Image source={{ uri: campaign.img }} style={styles.image} />
        <Text style={styles.description}>{campaign.description_content}</Text>
        <Text style={styles.label}>Guide:</Text>
        <Text style={styles.guide}>{campaign.guide}</Text>
        <Text style={styles.label}>Location:</Text>
        <Text style={styles.location}>{campaign.location.join(", ")}</Text>
        <Text style={styles.label}>Recycled Weight:</Text>
        <Text style={styles.value}>{campaign.recycled_weight} kg</Text>
        <Text style={styles.label}>Recycled Amount:</Text>
        <Text style={styles.value}>{campaign.recycled_amount}</Text>
        <Text style={styles.label}>Participants:</Text>
        <Text style={styles.value}>{campaign.participants}</Text>
        <Text style={styles.label}>Description Images:</Text>
        <ScrollView horizontal>
          {campaign.description_imgs.map((img, index) => (
            <Image key={index} source={{ uri: img }} style={styles.descriptionImage} />
          ))}
        </ScrollView>
      </ScrollView>

      <TouchableOpacity style={styles.joinButton} onPress={handleJoinCampaign}>
        <Text style={styles.joinButtonText}>Join Campaign</Text>
      </TouchableOpacity>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: wp(4),
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: theme.colors.error,
    fontSize: hp(2.2),
  },
  title: {
    fontSize: hp(2.8),
    fontWeight: theme.fonts.bold,
    color: theme.colors.text,
    marginLeft: wp(20), // Thêm thuộc tính này để tạo khoảng cách
    textAlign: "center",
  },
  image: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
    borderRadius: 10,
    marginBottom: hp(2),
  },
  description: {
    fontSize: hp(2),
    color: theme.colors.text,
    marginBottom: hp(2),
  },
  label: {
    fontSize: hp(2.2),
    fontWeight: theme.fonts.bold,
    color: theme.colors.text,
    marginBottom: hp(1),
  },
  guide: {
    fontSize: hp(2),
    color: theme.colors.text,
    marginBottom: hp(2),
    fontWeight: "normal", // Đảm bảo chữ thường
  },
  value: {
    fontSize: hp(2),
    color: theme.colors.text,
    marginBottom: hp(2),
  },
  location: {
    fontSize: hp(2),
    color: theme.colors.text,
    marginBottom: hp(2),
  },
  descriptionImage: {
    width: 100,
    height: 100,
    resizeMode: "cover",
    borderRadius: 10,
    marginRight: wp(2),
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: hp(2),
  },
  joinButton: {
    backgroundColor: theme.colors.primary,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    height: hp(6.6),
    marginHorizontal: 15,
    marginBottom: 15,
    paddingHorizontal: 20,
    width: "90%",
    borderRadius: theme.radius.xxl,
  },
  joinButtonText: {
    color: "white",
    fontSize: 25,
    fontWeight: "bold",
  },
});

export default CampaignDetail;
