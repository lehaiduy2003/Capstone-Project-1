import ProductService from "../../Product/Services/ProductService";
import { ObjectId } from "mongodb";
import userProfilesModel from "../Models/userProfilesModel";
import UserProductService from "./init/UserProductService";
import { ProductDTO, validateProductDTO } from "../../../libs/zod/dto/ProductDTO";
import { CartDTO, validateCartDTO } from "../../../libs/zod/dto/CartDTO";
import { ClientSession } from "mongoose";

type CartProduct = {
  cartQuantity: number;
} & ProductDTO;

interface ICart {
  total: number;
  data: CartProduct[];
}

export default class CartService extends UserProductService {
  constructor() {
    super(new ProductService());
  }

  private async checkValidQuantities(products: CartDTO): Promise<void> {
    for (const item of products) {
      const product = await this.getProductService().findById(item._id);
      if (!product) {
        throw new Error(`Product with ID ${item._id} not found`);
      }
      if (item.quantity > product.quantity) {
        throw new Error(`Quantity for product ${item._id} exceeds available stock`);
      }
    }
  }

  override async updateProduct(
    userId: ObjectId,
    productId: ObjectId,
    quantity: number
  ): Promise<ICart> {
    const user = await this.findUser(userId);
    const product = await this.findProduct(productId);

    if (product.quantity < quantity) {
      throw new Error("Not enough product in stock");
    }
    await this.startSession();
    this.startTransaction();
    const session = this.getSession();

    try {
      if (user.cart.some((cartProduct) => cartProduct._id.equals(product._id))) {
        // Update the quantity of the product in the cart
        // The session is committed in the updateQuantity method if it is successful
        // Else the method will throw an error and the session will be aborted by the catch block
        return await this.updateQuantity(userId, productId, quantity, session);
      }

      const addedStatus = await userProfilesModel
        .findOneAndUpdate(
          { _id: user._id },
          { $addToSet: { cart: { _id: product._id, quantity: quantity } } },
          { new: true, session: session }
        )
        .lean();

      // No need to abort transaction here because abortTransaction will be called twice by the catch block
      // If the adding fails, the method will throw an error and the session will be aborted
      if (!addedStatus) {
        throw new Error("Failed to add product");
      }

      await this.commitTransaction();
      return await this.getDetailsFromCart(userId, addedStatus.cart);
    } catch (error) {
      await this.abortTransaction();
      throw error;
    } finally {
      await this.endSession();
    }
  }

  override async removeProduct(userId: ObjectId, productId: ObjectId) {
    await this.startSession();
    this.startTransaction();
    const session = this.getSession();
    try {
      const removedStatus = await userProfilesModel
        .findOneAndUpdate(
          { _id: userId },
          { $pull: { cart: { _id: productId } } },
          { new: true, session: session }
        )
        .lean();

      if (!removedStatus) {
        throw new Error("Failed to remove product from the cart");
      }
      await this.commitTransaction();
      return await this.getDetailsFromCart(userId, removedStatus.cart);
    } catch (error) {
      await this.abortTransaction();
      throw error;
    } finally {
      await this.endSession();
    }
  }

  private async updateQuantity(
    userId: ObjectId,
    productId: ObjectId,
    quantity: number,
    session: ClientSession
  ) {
    if (quantity <= 0) {
      const updatedStatus = await userProfilesModel.findOneAndUpdate(
        { _id: userId, "cart._id": productId },
        { $pull: { cart: { _id: productId } } },
        { new: true, session: session }
      );

      if (!updatedStatus) throw new Error("Failed to update the quantity of product in the cart");
      await session.commitTransaction();
      return await this.getDetailsFromCart(userId, updatedStatus.cart);
    } else {
      const updatedStatus = await userProfilesModel.findOneAndUpdate(
        { _id: userId, "cart._id": productId },
        { $set: { "cart.$.quantity": quantity } },
        { new: true, session: session }
      );

      if (!updatedStatus) throw new Error("Failed to update the quantity of product in the cart");

      await session.commitTransaction();
      return await this.getDetailsFromCart(userId, updatedStatus.cart);
    }
  }

  private async getDetailsFromCart(userId: ObjectId, products: CartDTO) {
    let total = 0;
    let data = [];
    if (products.length === 0) return { total: 0, data: [] };
    // Fetch all product details concurrently
    const productDetailsPromises = products.map((product) =>
      this.getProductService().findById(product._id)
    );
    const productDetailsArray = await Promise.all(productDetailsPromises);

    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      const productDetails = productDetailsArray[i];

      if (!productDetails) {
        // Remove invalid product from the cart
        await this.removeProduct(userId, product._id);
        continue; // Skip invalid product
      }
      total += productDetails.price * product.quantity;
      data.push({ ...validateProductDTO(productDetails), cartQuantity: product.quantity });
    }
    return { total, data };
  }

  async getProducts(userId: ObjectId): Promise<ICart> {
    const user = await this.findUser(userId);
    const products = user.cart;
    return await this.getDetailsFromCart(userId, products);
  }

  override async setProducts(userId: ObjectId, cart: Partial<ProductDTO>[]) {
    const user = await this.findUser(userId);
    const parsedCart = validateCartDTO(cart);
    // Check for duplicate products
    if (this.checkForDuplicateProducts(parsedCart)) {
      throw new Error("Duplicate products found in the cart");
    }

    // Check for valid quantities
    await this.checkValidQuantities(parsedCart);

    await this.startSession();
    this.startTransaction();
    try {
      const updatedStatus = await userProfilesModel
        .findOneAndUpdate(
          { _id: user._id },
          { $set: { cart: parsedCart } },
          { new: true, session: this.getSession() }
        )
        .lean();

      if (!updatedStatus) {
        throw new Error("Failed to update the cart");
      }

      await this.commitTransaction();
      return await this.getDetailsFromCart(userId, updatedStatus.cart);
    } catch (error) {
      await this.abortTransaction();
      throw error;
    } finally {
      await this.endSession();
    }
  }
}
