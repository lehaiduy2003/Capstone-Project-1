import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import moment from "moment";
import ScreenWrapper from "../components/ScreenWrapper";
import Header from "../components/Header";
import { useRouter } from "expo-router";
import CustomCarousel from "../components/Carousel";
import { Ionicons } from "@expo/vector-icons";
import { getValueFor } from "../utils/secureStore";
import useSecureStore from "../store/useSecureStore";

const RecycleCampaignDetail = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { id } = route.params; // Extract the id from route parameters
  const router = useRouter();
  const [campaign, setCampaign] = useState(null);
  const { role } = useSecureStore();
  const [carouselImages, setCarouselImages] = useState([]);
  useEffect(() => {
    const fetchCampaign = async () => {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/campaigns/${id}`);
      const data = await response.json();
      setCampaign(data);
      const images = [...(data.img ? [data.img] : []), ...(data.description_imgs || [])];
      setCarouselImages(images);
    };
    fetchCampaign();
  }, [id]);

  const handleCloseCampaign = async () => {
    Alert.alert(
      "Confirm Close",
      "Are you sure you want to close this campaign?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Close",
          onPress: async () => {
            try {
              await fetch(`${process.env.EXPO_PUBLIC_API_URL}/campaigns/${id}`, {
                method: "DELETE",
                headers: {
                  Authorization: `Bearer ${await getValueFor("accessToken")}`,
                },
              });
              Alert.alert("Success", "Campaign closed successfully.");
              navigation.goBack();
            } catch (error) {
              Alert.alert("Error", "Failed to close the campaign.");
            }
          },
          style: "destructive",
        },
      ],
      { cancelable: true }
    );
  };

  console.log("Campaign:", campaign);

  const handleOpenCampaign = async () => {
    Alert.alert(
      "Confirm Open",
      "Are you sure you want to re open this campaign?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Confirm",
          onPress: async () => {
            try {
              await fetch(`${process.env.EXPO_PUBLIC_API_URL}/campaigns/${id}`, {
                method: "PATCH",
                headers: {
                  Authorization: `Bearer ${await getValueFor("accessToken")}`,
                },
              });
              Alert.alert("Success", "Campaign re-open successfully.");
              navigation.goBack();
            } catch (error) {
              Alert.alert("Error", "Failed to re-open the campaign.");
            }
          },
          style: "default",
        },
      ],
      { cancelable: true }
    );
  };

  if (!campaign) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScreenWrapper>
        <Header title={campaign.name} showBackButton backButtonPress={() => router.back()}></Header>
        <ScrollView style={styles.container}>
          <View>
            <CustomCarousel images={carouselImages} height={300} />
          </View>
          <View style={styles.card}>
            <Text style={styles.title}>{campaign.name}</Text>
            <Text style={styles.description}>{campaign.description_content}</Text>
            <View style={styles.infoRow}>
              <Ionicons name="calendar" size={20} color="#666" />
              <Text style={styles.date}>
                Created on: {moment(campaign.created_at).format("DD-MM-YYYY")}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="location" size={20} color="#666" />
              <Text style={styles.location}>Location: {campaign.location.join("; ")}</Text>
              {/* {campaign.location > 1 &&
                campaign.location.map((loc, index) => (
                  <Text key={index} style={styles.location}>
                    -{loc}
                  </Text>
                ))} */}
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="people" size={20} color="#666" />
              <Text style={styles.participants}>Participants: {campaign.participants}</Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="leaf" size={20} color="#666" />
              <Text style={styles.recycledWeight}>Recycled Weight: {campaign.recycled_weight}</Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="cube" size={20} color="#666" />
              <Text style={styles.recycledAmount}>
                Amount of recycled package: {campaign.recycled_amount}
              </Text>
            </View>
            {role === "recycler" ? (
              <>
                {campaign.status ? (
                  <TouchableOpacity style={styles.closeButton} onPress={handleCloseCampaign}>
                    <Text style={styles.actionButtonText}>Close Campaign</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity style={styles.openButton} onPress={handleOpenCampaign}>
                    <Text style={styles.actionButtonText}>Re-open Campaign</Text>
                  </TouchableOpacity>
                )}
              </>
            ) : (
              <TouchableOpacity
                style={styles.openButton}
                onPress={() => {
                  navigation.navigate("DonateRecycleDetail", { id: campaign._id });
                }}
              >
                <Text style={styles.actionButtonText}>create label for donation</Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </ScreenWrapper>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  carouselContainer: {
    marginBottom: 16,
  },
  closeButton: {
    backgroundColor: "#F44336",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
  },
  openButton: {
    backgroundColor: "green",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
  },
  actionButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    marginBottom: 16,
    color: "#666",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  date: {
    fontSize: 14,
    color: "#666",
    marginLeft: 8,
  },
  location: {
    fontSize: 14,
    color: "#666",
    marginLeft: 8,
  },
  participants: {
    fontSize: 14,
    color: "#666",
    marginLeft: 8,
  },
  recycledWeight: {
    fontSize: 14,
    color: "#666",
    marginLeft: 8,
  },
  recycledAmount: {
    fontSize: 14,
    color: "#666",
    marginLeft: 8,
  },
});

export default RecycleCampaignDetail;
