import { View, Text, StyleSheet } from "react-native";
import Button from "../../components/Button";

const CartFooter = ({ totalPrice, onCheckout }) => {
  return (
    <View style={styles.footer}>
      <Text style={styles.totalPrice}>Total price: {totalPrice.toFixed(2)} đ</Text>
      <View style={styles.containerCheckout}>
        <Button title="Checkout" onPress={onCheckout} />
      </View>
    </View>
  );
};

export default CartFooter;

const styles = StyleSheet.create({
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFF",
    padding: 16,
    borderTopWidth: 1,
    borderColor: "#DDD",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 65,
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: "bold",
  },
  containerCheckout: {},
});
