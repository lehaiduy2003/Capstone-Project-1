import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";

const QuantitySelector = ({ quantity, onIncrease, onDecrease, maxQuantity }) => {
  const handleDecrease = () => {
    if (quantity === 1) {
      Alert.alert("Remove Item", "Are you sure you want to remove this item from the cart?", [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Remove",
          onPress: onDecrease,
          style: "destructive",
        },
      ]);
    } else {
      onDecrease();
    }
  };
  return (
    <View style={styles.quantityContainer}>
      <TouchableOpacity onPress={handleDecrease}>
        <Text style={styles.quantityButton}>-</Text>
      </TouchableOpacity>
      <Text style={styles.quantityText}>{quantity}</Text>
      <TouchableOpacity
        onPress={onIncrease}
        disabled={quantity >= maxQuantity}
        style={quantity >= maxQuantity ? styles.disabledButton : styles.quantityButton}
      >
        <Text
          style={quantity >= maxQuantity ? styles.disabledButtonText : styles.quantityButtonText}
        >
          +
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default QuantitySelector;

const styles = StyleSheet.create({
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  quantityButton: {
    fontSize: 18,
    fontWeight: "bold",
    paddingHorizontal: 10,
  },
  disabledButton: {
    fontSize: 18,
    fontWeight: "bold",
    paddingHorizontal: 10,
    color: "gray",
  },
  quantityText: {
    fontSize: 18,
    fontWeight: "400",
    marginHorizontal: 8,
  },
  quantityButtonText: {
    color: "black",
  },
  disabledButtonText: {
    color: "gray",
  },
});
