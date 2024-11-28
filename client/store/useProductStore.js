import { create } from "zustand";
import { getValueFor } from "../utils/secureStore";

const useProductStore = create((set) => ({
  products: [],
  loading: false,
  error: null,

  // Fetch products by owner
  fetchProductsByOwner: async (ownerId) => {
    set({ loading: true, error: null });
    try {
      const accessToken = await getValueFor("accessToken");
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/users/${ownerId}/products`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch products.");
      }

      const data = await response.json();
      set({ products: data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  // Update a product
  updateProduct: async (productId, updatedProduct) => {
    set({ loading: true, error: null });
    try {
      const accessToken = await getValueFor("accessToken");

      // Exclude immutable fields
      const { owner, created_at, updated_at, ...updatableFields } = updatedProduct;

      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/users/${updatedProduct.owner}/products/${productId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ product: updatableFields }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update product.");
      }

      const updatedData = await response.json();
      set((state) => ({
        products: state.products.map((product) =>
          product._id === productId ? { ...product, ...updatedData } : product
        ),
        loading: false,
      }));
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  // Delete a product
  deleteProduct: async (productId) => {
    set({ loading: true, error: null });
    try {
      const accessToken = await getValueFor("accessToken");
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/products/${productId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      // Ensure the request was successful
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete product.");
      }

      // Update the store to remove the deleted product
      set((state) => ({
        products: state.products.filter((product) => product._id !== productId),
        loading: false,
      }));
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  addProduct: async (newProduct) => {
    set({ loading: true, error: null });
    try {
      const accessToken = await getValueFor("accessToken");
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(newProduct),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add product.");
      }

      const createdProduct = await response.json();
      set((state) => ({
        products: [...state.products, createdProduct],
        loading: false,
      }));
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error; // Ensure the error propagates to the UI
    }
  },


}));

export default useProductStore;
