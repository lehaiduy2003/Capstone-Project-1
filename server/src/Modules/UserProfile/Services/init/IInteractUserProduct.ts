import { ObjectId } from "mongodb";
import { ProductDTO } from "../../../../libs/zod/dto/ProductDTO";

export default interface IInteractUserProduct {
  updateProduct(userId: ObjectId, productId: ObjectId, quantity?: number): Promise<boolean>; // for adding and updating product to cart, favorite, etc.
  removeProduct(userId: ObjectId, productId: ObjectId): Promise<boolean>; // for removing product from cart, favorite, etc.
  getProducts(userId: ObjectId): Promise<Partial<ProductDTO>[]>; // for getting all products in cart, favorite, etc.
  setProducts(userId: ObjectId, products: Partial<ProductDTO>[]): Promise<boolean>; // for setting all products in cart, favorite, etc.
}
