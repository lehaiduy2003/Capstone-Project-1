import { CommonActions, useNavigation, useRoute } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import ScreenWrapper from "../../components/ScreenWrapper";
import Header from "../../components/Header";
import PickerModal from "../../components/PickerModal";
import useSecureStore from "../../store/useSecureStore";
import parsedCurrency from "../../utils/currency";
import useUserStore from "../../store/useUserStore";
import { Redirect, useRouter } from "expo-router";

const ProcessScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [width, setWidth] = useState("");
  const [length, setLength] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [codEnabled, setCodEnabled] = useState(false);
  const [insuranceEnabled, setInsuranceEnabled] = useState(false);
  const [codAmount, setCodAmount] = useState(null);
  const [codCurrency, setCodCurrency] = useState(null);
  const [codPaymentMethod, setCodPaymentMethod] = useState(null);
  const [insuranceAmount, setInsuranceAmount] = useState(null);
  const [insuranceContent, setInsuranceContent] = useState(null);
  const [insuranceCurrency, setInsuranceCurrency] = useState(null);
  const [insuranceProvider, setInsuranceProvider] = useState(null);
  const [parcelId, setParcelId] = useState(null);

  const [parcels, setParcels] = useState(null);
  const transaction = route.params.transaction;
  const { userId, accessToken } = useSecureStore();
  const [receiver, setReceiver] = useState(null);
  const { user } = useUserStore();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/users/${transaction.user_id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      setReceiver(data);
      setLoading(false);
    };
    const fetchParcel = async () => {
      setLoading(true);
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/shipping/parcels/users/${userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const data = await response.json();
      setParcels(data.data);
      setLoading(false);
      // console.log(data);
    };
    fetchUser();
    fetchParcel();
  }, []);

  useEffect(() => {
    if (parcelId === null) {
      return;
    }
    const fetchParcel = async () => {
      setLoading(true);
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/shipping/parcels/${parcelId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const data = await response.json();
      setWidth(data.data.width);
      setLength(data.data.length);
      setHeight(data.data.height);
      setWeight(data.data.weight);
      if (data.data.extra) {
        if (data.data.extra.cod) {
          setCodEnabled(true);
          setCodAmount(data.data.extra.cod.amount);
          setCodCurrency(data.data.extra.cod.currency);
          setCodPaymentMethod(data.data.extra.cod.paymentMethod);
        }
        if (data.data.extra.insurance) {
          setInsuranceEnabled(true);
          setInsuranceAmount(data.data.extra.insurance.amount);
          setInsuranceContent(data.data.extra.insurance.content);
          setInsuranceCurrency(data.data.extra.insurance.currency);
          setInsuranceProvider(data.data.extra.insurance.provider);
        }
      }
    };
    fetchParcel();
    setLoading(false);
  }, [parcelId]);

  const handleSubmit = async () => {
    // Process the input data
    try {
      setLoading(true);
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/shipping`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          user_id: userId, // Sender
          transaction_id: transaction._id,
          address_from: {
            name: user.name,
            phone: user.phone,
            street1: user.address[0],
            country: "VN",
          },
          address_to: {
            name: receiver.name,
            phone: receiver.phone,
            street1: transaction.shipping_address,
            country: "VN",
          },
          parcels: {
            length,
            width,
            distanceUnit: "cm",
            massUnit: "kg",
            height,
            weight,
            objectId: parcelId ? parcelId : null,
            extra: {
              cod: codEnabled
                ? {
                    amount: codAmount,
                    currency: codCurrency,
                    paymentMethod: codPaymentMethod,
                  }
                : null,
              insurance: insuranceEnabled
                ? {
                    amount: insuranceAmount,
                    content: insuranceContent,
                    currency: insuranceCurrency,
                    provider: insuranceProvider,
                  }
                : null,
            },
          },
        }),
      });
      const data = await response.json();
      setLoading(false);
      router.replace("(tabs)/HomePage");
    } catch (error) {
      setLoading(false);
      Alert.alert("Error", "Error while processing the order");
      console.log(error);
    }
    // Navigate to another screen or perform other actions
  };

  const handleCodEnabled = () => {
    setCodEnabled(!codEnabled);
    if (codEnabled === false) {
      setCodAmount(null);
      setCodCurrency(null);
      setCodPaymentMethod(null);
    }
  };

  const handleInsuranceEnabled = () => {
    setInsuranceEnabled(!insuranceEnabled);
    if (insuranceEnabled === false) {
      setInsuranceAmount(null);
      setInsuranceContent(null);
      setInsuranceCurrency(null);
      setInsuranceProvider(null);
    }
  };

  return (
    <ScreenWrapper style={styles.container}>
      <Header
        title={"ProcessScreen"}
        showBackButton={true}
        backButtonPress={() => navigation.goBack()}
      ></Header>
      <ScrollView>
        <View style={styles.productInfoContainer}>
          <View style={styles.receiverInfoContainer}>
            <Text style={styles.receiverInfoTitle}>Order Information</Text>
            <Text style={styles.receiverInfoText}>product: {transaction?.product.name}</Text>
            <Text style={styles.receiverInfoText}>
              price: {parsedCurrency("currency", "VND", transaction?.product.price)}
            </Text>
            <Text style={styles.receiverInfoText}>quantity: {transaction?.product.quantity}</Text>
            <Text style={styles.receiverInfoText}>
              payment method: {transaction?.payment_method}
            </Text>
            <Text style={styles.receiverInfoText}>
              payment status: {transaction?.payment_status}
            </Text>
            <Text style={styles.receiverInfoText}>ordered date: {transaction?.created_at}</Text>
          </View>
          <Image source={{ uri: transaction?.product.img }} style={styles.image} />
        </View>
        <View style={styles.receiverInfoContainer}>
          <Text style={styles.receiverInfoTitle}>Receiver Information</Text>
          <Text style={styles.receiverInfoText}>Name: {receiver?.name}</Text>
          <Text style={styles.receiverInfoText}>Phone: {receiver?.phone}</Text>
          <Text style={styles.receiverInfoText}>Address: {transaction.shipping_address}</Text>
        </View>
        <View>
          <PickerModal
            selectedValue={parcelId}
            onValueChange={setParcelId}
            items={parcels?.map((parcel) => ({
              label: parcel.label,
              value: parcel.parcel_id,
            }))}
            label="Using Exist Parcel"
          />
        </View>
        <Text>Please input parcel specification (cm - kg)</Text>
        <TextInput
          style={styles.input}
          returnKeyType="done"
          placeholder="Width"
          value={width}
          onChangeText={setWidth}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          returnKeyType="done"
          placeholder="Length"
          value={length}
          onChangeText={setLength}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          returnKeyType="done"
          placeholder="Height"
          value={height}
          onChangeText={setHeight}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          returnKeyType="done"
          placeholder="Weight"
          value={weight}
          onChangeText={setWeight}
          keyboardType="numeric"
        />
        <View style={styles.switchContainer}>
          <Text>Enable COD</Text>
          <Switch value={codEnabled} onValueChange={handleCodEnabled} />
        </View>
        {codEnabled && (
          <View>
            <TextInput
              style={styles.input}
              placeholder="COD Amount"
              value={codAmount}
              onChangeText={setCodAmount}
              returnKeyType="done"
              keyboardType="numeric"
            />
            <PickerModal
              selectedValue={codCurrency}
              onValueChange={setCodCurrency}
              items={[
                { label: "USD", value: "USD" },
                { label: "VND", value: "VND" },
              ]}
              label="Currency"
            />
            <PickerModal
              selectedValue={codPaymentMethod}
              onValueChange={setCodPaymentMethod}
              items={[
                { label: "Any", value: "any" },
                { label: "Cash", value: "cash" },
                { label: "Secured Funds", value: "SECURED_FUNDS" },
              ]}
              label="Payment Method"
            />
          </View>
        )}
        <View style={styles.switchContainer}>
          <Text>Enable Insurance</Text>
          <Switch value={insuranceEnabled} onValueChange={handleInsuranceEnabled} />
        </View>
        {insuranceEnabled && (
          <View>
            <TextInput
              returnKeyType="done"
              style={styles.input}
              placeholder="Insurance Amount"
              value={insuranceAmount}
              onChangeText={setInsuranceAmount}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="Insurance Content"
              value={codAmount}
              onChangeText={setCodAmount}
              returnKeyType="done"
            />
            <PickerModal
              selectedValue={insuranceCurrency}
              onValueChange={setInsuranceCurrency}
              items={[
                { label: "USD", value: "USD" },
                { label: "VND", value: "VND" },
              ]}
              label="Insurance currency"
            />
            <PickerModal
              selectedValue={insuranceProvider}
              onValueChange={setInsuranceProvider}
              items={[
                { label: "FEDEX", value: "FEDEX" },
                { label: "UPS", value: "UPS" },
                { label: "ONTRAC", value: "ONTRAC" },
              ]}
              label="Insurance currency"
            />
          </View>
        )}
      </ScrollView>
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Submit</Text>
      </TouchableOpacity>
      <Modal transparent={true} animationType="fade" visible={loading} onRequestClose={() => {}}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <ActivityIndicator size="large" color="green" />
            <Text>Loading...</Text>
          </View>
        </View>
      </Modal>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  container: {
    flex: 1,
    padding: 20,
  },
  productInfoContainer: {
    backgroundColor: "#f9f9f9",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  receiverInfoContainer: {
    backgroundColor: "#f9f9f9",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  image: {
    width: 100,
    height: 100,
    marginRight: 10,
    alignSelf: "center",
  },
  receiverInfoTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  receiverInfoText: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  pickerContainer: {
    marginBottom: 20,
  },
  pickerLabel: {
    fontSize: 16,
    marginBottom: 5,
  },
  pickerWrapper: {
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    overflow: "hidden",
  },
  picker: {
    height: 40,
    width: "100%",
  },
  submitButton: {
    backgroundColor: "green",
    padding: 10,
    alignItems: "center",
    borderRadius: 5,
  },
  submitButtonText: {
    color: "white",
    fontSize: 16,
  },
});

export default ProcessScreen;
