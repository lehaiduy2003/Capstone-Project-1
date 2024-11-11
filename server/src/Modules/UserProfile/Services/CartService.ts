import ProductService from "../../Product/Services/ProductService";
import { ObjectId } from "mongodb";
import userProfilesModel from "../Models/userProfilesModel";
import UserProductService from "./init/UserProductService";
import { ProductDTO } from "../../../libs/zod/dto/ProductDTO";
import { validateCartDTO } from "../../../libs/zod/dto/CartDTO";

export default class CartProductService extends UserProductService {
  constructor() {
    super(new ProductService());
  }

  override async updateProduct(
    userId: ObjectId,
    productId: ObjectId,
    quantity: number
  ): Promise<boolean> {
    const { user, product } = await this.checkAction(userId, productId);

    if (!product.quantity || product.quantity < quantity) {
      throw new Error("Not enough product in stock");
    } else {
      product.quantity = quantity;
    }

    if (user.cart.some((cartProduct) => cartProduct._id.equals(product._id))) {
      return await this.updateQuantity(userId, productId, quantity);
    }

    const addedStatus = await userProfilesModel
      .findOneAndUpdate(
        { _id: user._id },
        { $addToSet: { cart: { _id: product._id, quantity: product.quantity } } },
        { new: true }
      )
      .lean();

    if (!addedStatus) {
      throw new Error("Failed to add product");
    }

    return addedStatus.cart.some((cartProduct) => cartProduct._id.equals(product._id));
  }

  override async removeProduct(userId: ObjectId, productId: ObjectId) {
    const { user, product } = await this.checkAction(userId, productId);

    const removedStatus = await userProfilesModel
      .findOneAndUpdate({ _id: user._id }, { $pull: { cart: { _id: product._id } } }, { new: true })
      .lean();

    if (!removedStatus) throw new Error("Failed to remove product");

    return removedStatus.cart.every((cartProduct) => !cartProduct._id.equals(product._id));
  }

  private async updateQuantity(userId: ObjectId, productId: ObjectId, quantity: number) {
    if (quantity === 0) {
      const updatedStatus = await userProfilesModel.findOneAndUpdate(
        { _id: userId, "cart._id": productId },
        { $pull: { cart: { _id: productId } } },
        { new: true }
      );

      if (!updatedStatus) throw new Error("Failed to update the quantity of product in the cart");
      return updatedStatus.cart.every((cartProduct) => !cartProduct._id.equals(productId));
    } else {
      const updatedStatus = await userProfilesModel.findOneAndUpdate(
        { _id: userId, "cart._id": productId },
        { $set: { "cart.$.quantity": quantity } },
        { new: true }
      );

      if (!updatedStatus) throw new Error("Failed to update the quantity of product in the cart");
      return updatedStatus.cart.some(
        (cartProduct) => cartProduct._id.equals(productId) && cartProduct.quantity === quantity
      );
    }
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

  override async getProducts(userId: ObjectId): Promise<Partial<ProductDTO>[]> {
    const user = await this.findUser(userId);
    return validateCartDTO(user.cart);
  }
}
