import { ObjectId } from "mongodb";
// Return object because this data is use instantly after the update, remove, etc.
// So it's better to return the updated object data for preventing the client to request the data again
export default interface IInteractUserProduct {
  updateProduct(userId: ObjectId, productId: ObjectId, quantity?: number): Promise<object>; // for adding and updating product to cart, favorite, etc.
  removeProduct(userId: ObjectId, productId: ObjectId): Promise<object>; // for removing product from cart, favorite, etc.
}
