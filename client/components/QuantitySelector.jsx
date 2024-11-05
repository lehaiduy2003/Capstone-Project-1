import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const QuantitySelector = ({ quantity, onIncrease, onDecrease }) => {
  return (
    <View style={styles.quantityContainer}>
      <TouchableOpacity onPress={onDecrease}>
        <Text style={styles.quantityButton}>-</Text>
      </TouchableOpacity>
      <Text style={styles.quantityText}>{quantity}</Text>
      <TouchableOpacity onPress={onIncrease}>
        <Text style={styles.quantityButton}>+</Text>
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
  quantityText: {
    fontSize: 16,
    marginHorizontal: 8,
  },
});
