import ProductService from "../../Product/Services/ProductService";
import { ObjectId } from "mongodb";
import userProfilesModel from "../Models/userProfilesModel";
import UserProductService from "./init/UserProductService";
import { ProductDTO } from "../../../libs/zod/dto/ProductDTO";

export default class CartProductService extends UserProductService {
  constructor() {
    super(new ProductService());
  }

  override async addProduct(
    userId: ObjectId,
    productId: ObjectId,
    quantity: number
  ): Promise<boolean> {
    const user = await this.findUser(userId);
    const product = await this.findProduct(productId);

    if (!product.quantity || product.quantity < quantity) {
      throw new Error("Not enough product in stock");
    } else {
      product.quantity = quantity;
    }
    // Check if the product is already in the cart
    if (user.cart.includes(product)) {
      const updatedStatus = await userProfilesModel.findOneAndUpdate(
        { _id: user._id, "cart._id": product._id },
        { $set: { "cart.$.quantity": quantity } }
      );

      if (!updatedStatus)
        throw new Error("Failed to update the quantity of existed product in the cart");

      // Return the result of modified the quantity of existed product in the cart
      return updatedStatus?.isModified("cart");
    }

    const updatedStatus = await userProfilesModel.findOneAndUpdate(
      { _id: user._id },
      { $addToSet: { cart: product } },
      { new: true }
    );

    if (!updatedStatus) throw new Error("Failed to add product");

    // Return the result of added product to the cart
    return updatedStatus.cart.includes(product);
  }

  override async removeProduct(userId: ObjectId, productId: ObjectId) {
    const user = await this.findUser(userId);
    const product = await this.findProduct(productId);

    const updatedStatus = await userProfilesModel.findOneAndUpdate(
      { _id: user._id },
      { $pull: { cart: { _id: product._id } } },
      { new: true }
    );

    if (!updatedStatus) throw new Error("Failed to remove product");

    // return the result of removed product from the cart
    return !updatedStatus.cart.some((cartProduct) => cartProduct._id.equals(product._id));
  }

  async clearCart(userId: ObjectId) {
    const user = await this.findUser(userId);

    const updatedStatus = await userProfilesModel.findOneAndUpdate(
      { _id: user._id },
      { $set: { cart: [] } },
      { new: true }
    );

    if (!updatedStatus) throw new Error("Failed to clear the cart");

    return updatedStatus.cart.length === 0;
  }

  override async getProducts(userId: ObjectId): Promise<ProductDTO[]> {
    const user = await this.findUser(userId);
    return user.cart;
  }
}
