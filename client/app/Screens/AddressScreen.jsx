import { useRoute } from "@react-navigation/native";
import React, { useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Icon from "../../assets/icons";
import ScreenWrapper from "../../components/ScreenWrapper";
import Header from "../../components/Header";
import { useNavigation } from "expo-router";
import * as Location from "expo-location";
import { RadioButton } from "react-native-paper";
const AddressScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const params = route.params;
  const addresses = params.address;
  const [checkedAddress, setCheckedAddress] = useState(
    route.params?.defaultAddress || addresses[0]
  );

  const handleModifyAddress = async (modifiedAddress) => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      console.log("Permission to access location was denied");
      return;
    }
    // Geocode the physical address to get the coordinates
    try {
      let geocode = await Location.geocodeAsync(modifiedAddress);

      if (geocode.length > 0) {
        const location = {
          coords: { latitude: geocode[0].latitude, longitude: geocode[0].longitude },
        };
        navigation.navigate("Screens/MapScreen", {
          location,
          addresses,
          modifiedAddress,
          defaultAddress: modifiedAddress,
        });
      } else {
        console.log("Geocoding failed");
      }
    } catch (error) {
      console.error("Error in geocoding address:", error);
    }
  };

  const handleAddNewLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      console.log("Permission to access location was denied");
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    // Reverse geocode the location to get the physical address
    try {
      let reverseGeocode = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
      if (reverseGeocode.length > 0) {
        const modifiedAddress = `${reverseGeocode[0].name}, ${reverseGeocode[0].street}, ${reverseGeocode[0].city}, ${reverseGeocode[0].region}, ${reverseGeocode[0].postalCode}, ${reverseGeocode[0].country}`;
        navigation.navigate("Screens/MapScreen", { location, modifiedAddress, addresses });
      } else {
        console.log("Reverse geocoding failed");
      }
    } catch (error) {
      console.error("Error in reverse geocoding:", error);
    }
  };

  const handleAddressSelect = (address) => {
    setCheckedAddress(address);
    navigation.navigate("CheckOut", { defaultAddress: address });
  };

  return (
    <ScreenWrapper>
      <Header title={"Shipping Address"} showBackButton />

      <View style={styles.flatListContainer}>
        <FlatList
          data={addresses}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <View>
              <View key={index} style={styles.addressContainer}>
                <TouchableOpacity style={styles.addressSelectTouchable}>
                  <RadioButton
                    value={item}
                    status={checkedAddress === item ? "checked" : "unchecked"}
                    onPress={() => {
                      if (checkedAddress !== item) {
                        handleAddressSelect(item);
                      } else {
                        navigation.navigate("CheckOut");
                      }
                    }}
                  />
                  <Text>{item}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleModifyAddress(item)}>
                  <Icon name="edit" style={styles.editIcon} size={26} strokeWidth={1.6} />
                </TouchableOpacity>
              </View>
              <View style={styles.divider} />
            </View>
          )}
          contentContainerStyle={styles.flatListContent}
        />
      </View>

      <TouchableOpacity style={styles.addNewLocation} onPress={handleAddNewLocation}>
        <Text style={styles.addNewLocationText}>Add new location with current position</Text>
      </TouchableOpacity>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  addressSelectTouchable: {
    flexDirection: "row",
    alignItems: "center",
  },
  flatListContainer: {
    flex: 0,
  },
  flatListContent: {
    paddingBottom: 20,
  },
  addressContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
  },
  editIcon: {
    marginRight: 10,
  },
  checkbox: {
    marginLeft: 10,
  },
  divider: {
    height: 1,
    backgroundColor: "#CED0CE",
    marginVertical: 10,
  },
  addNewLocation: {
    marginTop: 20,
    padding: 10,
    alignItems: "center",
  },
  addNewLocationText: {
    color: "green",
    fontSize: 16,
  },
});

export default AddressScreen;
