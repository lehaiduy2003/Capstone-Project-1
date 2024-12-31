import { useNavigation } from "@react-navigation/native";
import { getValueFor } from "../../utils/secureStore";
import { useEffect, useState } from "react";
import { Alert, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ScreenWrapper from "../../components/ScreenWrapper";
import moment from "moment";
const RecycleCampaignManagement = () => {
  const navigation = useNavigation();
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchCampaigns = async () => {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/campaigns/users/${await getValueFor("userId")}`,
        {
          headers: {
            Authorization: `Bearer ${await getValueFor("accessToken")}`,
          },
        }
      );
      const data = await response.json();
      // console.log("Campaigns:", data);

      setData(data);
    };
    fetchCampaigns();
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate("RecycleCampaignDetail", { id: item._id })}
    >
      <View key={item._id} style={styles.itemContainer}>
        <View style={styles.itemDetails}>
          <Text style={styles.itemName}>{item.name}</Text>
          {item.location &&
            item.location.map((loc, index) => (
              <Text key={index} style={styles.itemAddress}>
                {loc}
              </Text>
            ))}
          <Text style={styles.itemDate}>{moment(item.created_at).format("DD-MM-YYYY")}</Text>
        </View>
        <View>
          <Image source={{ uri: item.img }} style={styles.itemImage} />
          {!item.status && (
            <View style={styles.closedOverlay}>
              <Text style={styles.closedText}>Closed</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderSeparator = () => <View style={styles.divider} />;

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
          ItemSeparatorComponent={renderSeparator}
          contentContainerStyle={styles.flatListContent}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
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
  itemImage: {
    width: 100,
    height: 100,
    resizeMode: "cover",
  },
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    borderRadius: 8,
    overflow: "hidden",
    elevation: 5,
  },
  divider: {
    height: 1,
    backgroundColor: "#ccc",
    marginVertical: 10,
    width: "90%",
    alignSelf: "center",
  },
  itemDetails: {
    display: "flex",
    padding: 16,
  },
  itemName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  itemAddress: {
    marginTop: 8,
    fontSize: 14,
    color: "#666",
  },

  itemDate: {
    marginTop: 8,
    fontSize: 14,
    color: "green",
  },
  actions: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-around",
    padding: 16,
  },
  editButton: {
    backgroundColor: "#4CAF50",
    padding: 8,
    borderRadius: 4,
    marginHorizontal: 4,
    width: 60,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  editButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  deleteButton: {
    backgroundColor: "#F44336",
    padding: 8,
    borderRadius: 4,
    marginHorizontal: 4,
    width: 60,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  deleteButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  flatListContent: {
    paddingBottom: 50,
  },
});

export default RecycleCampaignManagement;
