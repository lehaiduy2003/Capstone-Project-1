// cartItemsStore.js
import { create } from "zustand";
import { getValueFor } from "../utils/secureStore";

const fetchCart = async (url, options) => {
  const response = await fetch(url, {
    method: options.method,
    headers: options.headers,
    body: options.body ? JSON.stringify(options.body) : null,
  });
  return await response.json();
};

// Create a store for the cart
// Set data after fetching from the API
const useCartStore = create((set, get) => ({
  cartItems: [],
  totalPrice: 0,
  initializeCart: async () => {
    const data = await fetchCart(
      `${process.env.EXPO_PUBLIC_API_URL}/users/${await getValueFor("userId")}/cart`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${await getValueFor("accessToken")}`,
        },
      }
    );
    set({
      cartItems: data.data,
      totalPrice: data.total,
    });
    // console.log("Cart initialized with items:", get().cartItems);
    // console.log("Total price:", get().totalPrice);
  },

  // Add product to cart
  // If product already exists in cart, update the quantity (already handled in the backend)
  addProduct: async (productId, quantity) => {
    const product = get().cartItems.find((item) => item._id === productId);

    let updatingProduct;

    // If index is valid, update the quantity of the product
    if (product) {
      // Increase the quantity of the product
      updatingProduct = {
        _id: productId,
        quantity: product.cartQuantity + quantity,
      };
    } else {
      // If index is not valid, add the new product to the cart
      updatingProduct = { _id: productId, quantity: quantity };
    }

    const data = await fetchCart(
      `${process.env.EXPO_PUBLIC_API_URL}/users/${await getValueFor("userId")}/cart/product`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${await getValueFor("accessToken")}`,
        },
        body: {
          product_id: updatingProduct._id,
          quantity: updatingProduct.quantity,
        },
      }
    );
    console.log("Updated cart:", JSON.stringify(data.data, null, 2));
    set({
      cartItems: data.data,
      totalPrice: data.total,
    });
  },
  // Update quantity of a product in the cart
  // Using PUT method to overwrite the cart with updated quantity
  updateQuantity: async (productId, quantity) => {
    // Loop through the cartItems array
    const updatedCartItems = get()
      .cartItems.map((item) =>
        item._id === productId ? { ...item, cartQuantity: item.cartQuantity + quantity } : item
      )
      .filter((item) => item.cartQuantity > 0) // Remove product if quantity is 0
      .map((item) => ({ _id: item._id, quantity: item.cartQuantity })); // Only keep _id and cartQuantity as quantity

    const data = await fetchCart(
      `${process.env.EXPO_PUBLIC_API_URL}/users/${await getValueFor("userId")}/cart`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${await getValueFor("accessToken")}`,
        },
        body: {
          cart: updatedCartItems,
        },
      }
    );
    // console.log("Updated cart:", JSON.stringify(data.data, null, 2));

    set({
      cartItems: data.data,
      totalPrice: data.total,
    });
  },

  removeProduct: async (productId) => {
    const data = await fetchCart(
      `${process.env.EXPO_PUBLIC_API_URL}/users/${await getValueFor(
        "userId"
      )}/cart/product/${productId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${await getValueFor("accessToken")}`,
        },
      }
    );
    set({
      cartItems: data.data,
      totalPrice: data.total,
    });
  },

  clearCart: async () => {
    const data = await fetchCart(
      `${process.env.EXPO_PUBLIC_API_URL}/users/${await getValueFor("userId")}/cart`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${await getValueFor("accessToken")}`,
        },
        body: { cart: [] },
      }
    );
    set({
      cartItems: data.data,
      totalPrice: data.total,
    });
  },
}));

export default useCartStore;
