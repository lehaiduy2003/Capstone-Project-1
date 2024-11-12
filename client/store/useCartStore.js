// cartItemsStore.js
import { create } from "zustand";
import useSecureStore from "./useSecureStore";
import { debounce } from "lodash";
import { getValueFor } from "../utils/secureStore";
const useCartStore = create((set, get) => ({
  cartItems: [],
  totalPrice: 0,
  initializeCart: async () => {
    const userCart = await initCart();
    set({
      cartItems: userCart.items,
    });
    await calculateTotalPrice();
    // console.log("Cart initialized with items:", get().cartItems);
    // console.log("Total price:", get().totalPrice);
  },

  addProduct: async (id, quantity) => {
    set((state) => {
      // Find the index of the product in cartItems
      const productIndex = state.cartItems.findIndex((item) => item._id === id);

      let updatedCartItems;

      // If index is valid, update the quantity of the product
      if (productIndex !== -1) {
        // Copy the cartItems array
        updatedCartItems = [...state.cartItems];
        // Increase the quantity of the product at productIndex
        updatedCartItems[productIndex] = {
          // Copy the old product object data
          ...updatedCartItems[productIndex],
          // Increase the quantity
          quantity: updatedCartItems[productIndex].quantity + quantity,
        };
      } else {
        // If index is not valid, add the new product to the cart
        updatedCartItems = [...state.cartItems, { _id: id, quantity: quantity }];
      }
      // console.log("Updated cart items:", updatedCartItems);

      return { cartItems: updatedCartItems };
    });

    const options = {
      method: "PATCH",
      accessToken: await getValueFor("accessToken"),
      body: { productId: id, quantity: quantity },
    };
    const userId = await getValueFor("userId");
    await fetchCart(`${process.env.EXPO_PUBLIC_API_URL}/users/${userId}/cart/product`, options);
    await calculateTotalPrice();
  },

  updateQuantity: (productId, quantity) => {
    set((state) => {
      // Loop through the cartItems array
      const updatedCartItems = state.cartItems
        .map((item) =>
          item._id === productId ? { ...item, quantity: item.quantity + quantity } : item
        )
        .filter((item) => item.quantity > 0); // Remove product if quantity is 0
      return { cartItems: updatedCartItems };
    });

    debouncedFetchCart();
  },

  removeProduct: async (productId) => {
    set((state) => {
      const updatedCartItems = state.cartItems.filter((item) => item._id !== productId);

      return { cartItems: updatedCartItems };
    });
    const options = {
      method: "DELETE",
      accessToken: await getValueFor("accessToken"),
    };
    const userId = await getValueFor("userId");
    await fetchCart(
      `${process.env.EXPO_PUBLIC_API_URL}/users/${userId}/cart/product/${productId}`,
      options
    );
    await calculateTotalPrice();
  },

  clearCart: async () => {
    set({ cartItems: [] });
    const options = {
      method: "PUT",
      accessToken: await getValueFor("accessToken"),
      body: [],
    };
    const userId = useSecureStore((state) => state.userId);
    await fetchCart(`${process.env.EXPO_PUBLIC_API_URL}/users/${userId}/cart`, options);
    await calculateTotalPrice();
  },
}));

const fetchCart = async (url, options) => {
  try {
    const response = await fetch(url, {
      method: options.method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${options.accessToken}`,
      },
      body: options.body ? JSON.stringify(options.body) : null,
    });
    const cart = await response.json();
    // console.log("Cart updated:", cart);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

const initCart = async () => {
  try {
    const userId = await getValueFor("userId");
    const accessToken = await getValueFor("accessToken");

    const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/users/${userId}/cart`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const data = await response.json();
    return {
      items: data,
    };
  } catch (error) {
    throw error;
  }
};

const debouncedFetchCart = debounce(async () => {
  const options = {
    method: "PUT",
    accessToken: await getValueFor("accessToken"),
    body: { cart: useCartStore.getState().cartItems },
  };
  const userId = await getValueFor("userId");
  await fetchCart(`${process.env.EXPO_PUBLIC_API_URL}/users/${userId}/cart`, options);
  await calculateTotalPrice();
}, 500); // 500ms delay

const calculateTotalPrice = async () => {
  const cartItems = useCartStore.getState().cartItems;

  // Fetch prices for all cart items
  const prices = await Promise.all(
    cartItems.map(async (item) => {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/products/${item._id}`);
      const data = await response.json();
      // console.log("Product data:", data);
      return data.price * item.quantity;
    })
  );
  // Calculate the total price
  const totalPrice = prices.reduce((acc, curr) => acc + curr, 0);
  // Update the state with the new total price
  useCartStore.setState({ totalPrice: totalPrice });
};

export default useCartStore;
