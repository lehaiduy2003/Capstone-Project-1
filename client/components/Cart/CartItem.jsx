import { View, Text, Image, StyleSheet } from "react-native";
import QuantitySelector from "../QuantitySelector";
import parsedCurrency from "../../utils/currency";
const CartItem = ({ item, onIncrease, onDecrease }) => {
  const price = parsedCurrency("currency", "VND", item.price);
  return (
    <View style={styles.cartItem}>
      <Image source={{ uri: item.img }} style={styles.itemImage} />
      <View style={styles.itemDetails}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemPrice}>{price}</Text>
      </View>
      <QuantitySelector
        quantity={item.cartQuantity}
        onIncrease={onIncrease}
        onDecrease={onDecrease}
        // item.quantity is the maximum available quantity from the database
        maxQuantity={item.quantity}
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
