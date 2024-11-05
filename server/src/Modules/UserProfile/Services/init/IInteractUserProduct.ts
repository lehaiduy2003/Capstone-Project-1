import { ObjectId } from "mongodb";

export default interface IInteractUserProduct {
  addProduct(userId: ObjectId, productId: ObjectId, quantity: number): Promise<boolean>; // for adding product to cart, favorite, etc.
  removeProduct(userId: ObjectId, productId: ObjectId): Promise<boolean>; // for removing product from cart, favorite, etc.
}
