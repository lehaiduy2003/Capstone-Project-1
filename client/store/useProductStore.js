import { create } from "zustand";
import { getValueFor } from "../utils/secureStore";
import useSecureStore from "../store/useSecureStore";

const useProductStore = create((set, get) => ({
  products: [],
  loading: false,
  error: null,
  userId: null,

  // Fetch products by owner
  fetchProductsByOwner: async (ownerId) => {
    set({ loading: true, error: null });
    try {
      const accessToken = await getValueFor("accessToken");
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/users/${ownerId}/products`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

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
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/products/${productId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

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
      // Validate required fields
      if (!newProduct.name || typeof newProduct.name !== "string") {
        throw new Error("Product name is required and must be a string.");
      }
      if (!newProduct.price || isNaN(newProduct.price)) {
        throw new Error("Product price is required and must be a valid number.");
      }
      if (!newProduct.type || typeof newProduct.type !== "string") {
        throw new Error("Product type is required and must be a string.");
      }
      if (!newProduct.owner || typeof newProduct.owner !== "string") {
        throw new Error("Owner ID is required and must be a string.");
      }

      // Fetch access token
      const accessToken = await getValueFor("accessToken");
      if (!accessToken) {
        throw new Error("Access token is missing. Please log in again.");
      }

      // Prepare payload
      const productPayload = {
        name: newProduct.name,
        price: parseFloat(newProduct.price),
        quantity: newProduct.quality || 1,
        type: newProduct.type,
        owner: newProduct.owner,
        description_content: newProduct.description_content || "",
        description_imgs: newProduct.description_imgs || [],
        img: newProduct.img || "",
      };

      console.log("Final Product Payload:", productPayload);

      // Send request
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/users/${newProduct.owner}/products`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(productPayload),
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Session expired. Please log in again.");
        }

        const errorData = await response.json();
        console.error("Add Product Error Response:", errorData);
        throw new Error(errorData.message || "Failed to add product.");
      }

      // Parse and validate response
      let createdProduct;
      try {
        createdProduct = await response.json();
      } catch (parseError) {
        console.error("Failed to parse server response:", parseError.message);
        throw new Error("Server returned an invalid response.");
      }

      if (!createdProduct || !createdProduct._id) {
        throw new Error("Invalid product data received from server.");
      }

      // Log the product ID
      console.log("Product added with ID:", createdProduct._id);

      // Update state
      set((state) => ({
        products: [...state.products, createdProduct],
        loading: false,
      }));
    } catch (error) {
      console.error("Add Product Error:", error.message);
      set({ error: error.message, loading: false });
      throw error; // Allow the calling component to handle the error
    }
  },
}));

export default useProductStore;
