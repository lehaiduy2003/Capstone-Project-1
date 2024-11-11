// cartItemsStore.js
import { create } from "zustand";
import useSecureStore from "./useSecureStore";

const useCartStore = create((set, get) => ({
  cartItems: [],

  initializeCart: async () => {
    const userCart = await loadCartFromDB();
    set({
      cartItems: userCart.items,
    });
    console.log("Cart initialized with items:", userCart.items);
  },

  addProduct: (product) => {
    set((state) => {
      // Add product to cartItems or update quantity if it already exists
      const existingProduct = state.cartItems.find((item) => item._id === product._id);
      let updatedCartItems;

      if (existingProduct) {
        updatedCartItems = state.cartItems.map((item) =>
          item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        updatedCartItems = [...state.cartItems, { ...product, quantity: 1 }];
      }

      saveCartToDB(product._id, product.quantity);

      return { cartItems: updatedCartItems };
    });
  },
  increaseProductQuantity: (productId) => {
    set((state) => {
      const updatedCartItems = state.cartItems.map((item) =>
        item._id === productId ? { ...item, quantity: item.quantity + 1 } : item
      );

      return { cartItems: updatedCartItems };
    });
  },

  decreaseProductQuantity: (productId) => {
    set((state) => {
      const updatedCartItems = state.cartItems
        .map((item) => (item._id === productId ? { ...item, quantity: item.quantity - 1 } : item))
        .filter((item) => item.quantity > 0); // Remove items with quantity 0

      return { cartItems: updatedCartItems };
    });
  },

  removeProduct: (productId) => {
    set((state) => {
      // Remove product or decrease quantity
      const updatedCartItems = state.cartItems
        .map((item) => (item._id === productId ? { ...item, quantity: item.quantity - 1 } : item))
        .filter((item) => item.quantity > 0);

      saveCartToDB(get().userId, updatedCartItems);

      return { cartItems: updatedCartItems };
    });
  },
}));

const loadCartFromDB = async () => {
  try {
    const { accessToken } = useSecureStore((state) => state.accessToken);
    const { userId } = useSecureStore((state) => state.userId);
    const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/users/${userId}/cart`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const products = await response.json();
    return {
      items: products,
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return {
      items: [],
    };
  }
};

// Hàm mô phỏng lưu giỏ hàng vào cơ sở dữ liệu
const saveCartToDB = async (productId, quantity) => {
  // Lưu giỏ hàng và tổng giá vào DB với userId tương ứng
  const { accessToken } = useSecureStore((state) => state.accessToken);
  const { userId } = useSecureStore((state) => state.userId);
  const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/users/${userId}/cart/product`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ productId: productId, quantity: quantity }),
  });
  const product = await response.json();
  console.log("Product added to cart:", product);
};

export default useCartStore;
