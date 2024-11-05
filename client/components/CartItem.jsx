import { View, Text, Image, StyleSheet } from "react-native";
import QuantitySelector from "../components/QuantitySelector";
import currency from "../utils/currency";

const CartItem = ({ item, onIncrease, onDecrease }) => {
  currency;

  return (
    <View style={styles.cartItem}>
      <Image source={{ uri: item.img }} style={styles.itemImage} />
      <View style={styles.itemDetails}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemPrice}>{currency}</Text>
      </View>
      <QuantitySelector
        quantity={item.quantity}
        onIncrease={onIncrease}
        onDecrease={onDecrease}
      />
    </View>
  );
};

export default CartItem;

const styles = StyleSheet.create({
  cartItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
    elevation: 2,
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 10,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  itemPrice: {
    fontSize: 14,
    color: "#888",
  },
});
