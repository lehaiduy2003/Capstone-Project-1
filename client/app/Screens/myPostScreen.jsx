import React from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Image, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { getValueFor } from "../../utils/secureStore";
import ScreenWrapper from "../../components/ScreenWrapper";
import Header from "../../components/Header";

const PostScreen = () => {
  const navigation = useNavigation();
  const [data, setData] = React.useState([]);

  React.useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/posts/users/${await getValueFor("userId")}`
      );
      const data = await response.json();
      setData(data.data);
    };
    fetchPosts();
  }, []);

  const handleDelete = async (id) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this post?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: async () => {
            try {
              await fetch(`${process.env.EXPO_PUBLIC_API_URL}/posts/${id}`, {
                method: "DELETE",
              });
              setData(data.filter((post) => post._id !== id));
            } catch (error) {
              Alert.alert("Error", "Failed to delete the post.");
            }
          },
          style: "destructive",
        },
      ],
      { cancelable: true }
    );
  };

  const renderItem = ({ item }) => (
    <View key={item._id} style={styles.itemContainer}>
      <TouchableOpacity onPress={() => navigation.navigate("PostDetail", { id: item._id })}>
        <View style={styles.itemDetails}>
          {item.description_imgs && item.description_imgs.length > 0 && (
            <Image source={{ uri: item.description_imgs[0] }} style={styles.itemImage} />
          )}
          <View style={styles.itemInfo}>
            <Text style={styles.itemName}>{item.title}</Text>
            <Text style={styles.itemDescription}>{item.description_content}</Text>
          </View>
          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => navigation.navigate("EditPost", { id: item._id })}
            >
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(item._id)}>
              <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
      <View style={styles.divider} />
    </View>
  );

  const renderSeparator = () => <View style={styles.divider} />;

  return (
    <ScreenWrapper>
      <Header
        title={"My Post"}
        showBackButton={true}
        backButtonPress={() => navigation.goBack()}
      ></Header>
      <View style={styles.container}>
        <FlatList
          ItemSeparatorComponent={renderSeparator}
          data={data}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ paddingBottom: 80 }}
        />
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 8,
    overflow: "hidden",
    elevation: 5,
  },
  divider: {
    height: 1,
    backgroundColor: "#ccc",
    marginVertical: 8,
    width: "90%",
    alignSelf: "center",
  },
  itemContent: {
    flex: 1,
    flexDirection: "row",
  },
  itemImage: {
    width: 100,
    height: 100,
    resizeMode: "cover",
  },
  flatListContent: {
    paddingBottom: 16,
  },
  itemDetails: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  itemInfo: {
    width: "50%",
    display: "flex",
    gap: 8,
    paddingHorizontal: 10,
    flexDirection: "column",
  },
  itemName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  itemDescription: {
    fontSize: 14,
    color: "#666",
  },
  actions: {
    flexDirection: "column",
    gap: 8,
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
});
export default PostScreen;
