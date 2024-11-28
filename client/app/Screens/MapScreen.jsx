import React, { useState } from "react";
import { Alert, Button, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { useRoute } from "@react-navigation/native";
import ScreenWrapper from "../../components/ScreenWrapper";
import Header from "../../components/Header";
import Icon from "../../assets/icons";
import * as Location from "expo-location";
import useSecureStore from "../../store/useSecureStore";
import { theme } from "../../constants/theme";
import { useNavigation } from "expo-router";
const MapScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { accessToken } = useSecureStore();
  const { location, modifiedAddress, defaultAddress } = route.params;
  const [inputAddress, setInputAddress] = useState(modifiedAddress || defaultAddress || "");
  const [coordinates, setCoordinates] = useState({
    latitude: location.coords.latitude,
    longitude: location.coords.longitude,
  });
  const handleAddressChange = async (inputAddress) => {
    setInputAddress(inputAddress);
  };
  const handleSearch = async () => {
    try {
      let geocode = await Location.geocodeAsync(inputAddress);

      if (geocode.length > 0) {
        setCoordinates({
          latitude: geocode[0].latitude,
          longitude: geocode[0].longitude,
        });
      } else {
        Alert.alert("Error", "Geocoding failed. Please enter a valid address.");
      }
    } catch (error) {
      console.error("Error in geocoding address:", error);
      Alert.alert("Error", "Geocoding failed. Please try again.");
    }
  };
  const handleConfirm = async () => {
    if (inputAddress && coordinates) {
      try {
        const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/profile/address`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            addresses: inputAddress,
          }),
        });
        const data = await response.json();
        if (response.ok) {
          navigation.replace("CheckOut", {
            defaultAddress: inputAddress,
          });
        } else {
          Alert.alert("Error", data.message || "Failed to update address.");
        }
      } catch (error) {
        console.error("Error updating address:", error);
        Alert.alert("Error", "Failed to update address. Please try again.");
      }
    } else {
      Alert.alert("Error", "Please enter a valid address.");
    }
  };
  return (
    <ScreenWrapper>
      <Header title={"Location"} showBackButton />
      <View style={styles.container}>
        <MapView
          style={styles.map}
          region={{
            latitude: coordinates.latitude,
            longitude: coordinates.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          <Marker
            coordinate={{
              latitude: coordinates.latitude,
              longitude: coordinates.longitude,
            }}
            title="Current location"
            description={inputAddress}
          />
        </MapView>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter address"
            value={inputAddress}
            onChangeText={handleAddressChange}
          />
          <TouchableOpacity style={styles.searchIcon} onPress={handleSearch}>
            <Icon name="search" size={24} color="green" />
          </TouchableOpacity>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
            <Text color={"green"}>Confirm</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  confirmButton: {
    backgroundColor: theme.colors.primary,
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    position: "absolute",
    top: 10,
    left: 10,
    right: 10,
    backgroundColor: "white",
    padding: 10,
    borderRadius: 5,
    elevation: 5,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    paddingLeft: 8,
  },
  searchIcon: {
    marginLeft: 10,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 20,
    left: 10,
    right: 10,
    backgroundColor: "white",
    padding: 10,
    borderRadius: 5,
    elevation: 5,
  },
});
export default MapScreen;
