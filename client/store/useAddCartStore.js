import create from 'zustand';

const useCartStore = create((set) => ({
  cart: [],

  addToCart: (item) => set((state) => {
    // Check if the item is already in the cart
    const existingItem = state.cart.find(cartItem => cartItem.id === item.id);

    if (existingItem) {
      // If item exists, increase the quantity
      return {
        cart: state.cart.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        ),
      };
    } else {
      // If item does not exist, add it with quantity 1
      return {
        cart: [...state.cart, { ...item, quantity: 1 }],
      };
    }
  }),

  // Optional: other cart-related actions, e.g., removeFromCart, clearCart, etc.
}));

export default useCartStore;
