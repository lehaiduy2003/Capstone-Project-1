// // productAPI.js
// import { getValueFor } from "../utils/secureStore";

// export const fetchProductsByOwner = async (ownerId) => {
//   try {
//     const accessToken = await getValueFor("accessToken");
//     const response = await fetch(
//       `${process.env.EXPO_PUBLIC_API_URL}/products?ownerId=${ownerId}`,
//       {
//         method: "GET",
//         headers: {
//           Authorization: `Bearer ${accessToken}`,
//         },
//       }
//     );

//     if (!response.ok) {
//       const errorText = await response.text();
//       console.error("Failed to fetch products by owner:", errorText);
//       throw new Error(`Failed to fetch products: ${response.status}`);
//     }

//     const data = await response.json();
//     return data;
//   } catch (error) {
//     console.error("Error fetching products by owner:", error);
//     throw error;
//   }
// };

// export const updateProductOnServer = async (productId, updatedData) => {
//   try {
//     const accessToken = await getValueFor("accessToken");
//     const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/products/${productId}`, {
//       method: "PATCH",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${accessToken}`,
//       },
//       body: JSON.stringify(updatedData),
//     });

//     if (!response.ok) {
//       const errorText = await response.text();
//       console.error("Failed to update product:", errorText);
//       throw new Error(`Failed to update product: ${response.status}`);
//     }

//     return await response.json();
//   } catch (error) {
//     console.error("Error updating product:", error);
//     throw error;
//   }
// };
