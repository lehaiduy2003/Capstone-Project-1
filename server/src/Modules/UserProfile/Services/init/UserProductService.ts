import { ObjectId } from "mongodb";
import userProfilesModel from "../../Models/userProfilesModel";
import { UserProfile } from "../../../../libs/zod/model/UserProfile";
import ProductService from "../../../Product/Services/ProductService";
import { ProductDTO, validateProductDTO } from "../../../../libs/zod/dto/ProductDTO";
import IInteractUserProduct from "./IInteractUserProduct";
import { CartDTO } from "../../../../libs/zod/dto/CartDTO";

export default abstract class UserProductService implements IInteractUserProduct {
  private readonly productService: ProductService;

  protected constructor(productService: ProductService) {
    this.productService = productService;
  }

  getProductService() {
    return this.productService;
  }

  async findUser(userId: ObjectId): Promise<UserProfile> {
    const user = await userProfilesModel.findOne({ _id: userId }).lean();
    // console.log(user);

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  }

  async findProduct(productId: ObjectId) {
    const product = await this.productService.findById(productId);
    // console.log(product);

    if (!product) {
      throw new Error("Product not found");
    }
    return validateProductDTO(product);
  }

  async checkAction(userId: ObjectId, productId: ObjectId) {
    const user = await this.findUser(userId);
    const product = await this.findProduct(productId);

    if (String(user._id) === String(product.owner)) {
      throw new Error("Cannot interact with your own product");
    } else return { user, product };
  }

  checkForDuplicateProducts(products: Partial<ProductDTO>[]): boolean {
    const productIds = products.map((product) => product._id?.toString());
    const uniqueProductIds = new Set(productIds);
    return productIds.length !== uniqueProductIds.size;
  }

  async checkValidQuantities(products: Partial<ProductDTO>[]): Promise<void> {
    for (const item of products) {
      if (!item._id) {
        throw new Error(`Product ID not provided`);
      }
      const product = await this.productService.findById(item._id);
      if (!product) {
        throw new Error(`Product with ID ${item._id} not found`);
      }
      if (!product) {
        throw new Error(`Product with ID ${item._id} not found`);
      }
      if (item.quantity === undefined || item.quantity > product.quantity) {
        throw new Error(`Quantity for product ${item._id} exceeds available stock`);
      }
    }
  }

  // Get the list of products that user interacted with
  abstract getProducts(userId: ObjectId): Promise<Partial<ProductDTO>[]>; // It can be cart, wishlist, etc.
  abstract setProducts(userId: ObjectId, products: Partial<ProductDTO>[]): Promise<boolean>; // It can be cart, wishlist, etc.
  /**
   * @param userId - The user id
   * @param productId - The product id
   * @param quantity - The quantity of the product (optional for wishlist, favorite, etc.)
   * @returns {Promise<boolean>} The result of modified ```the user's product list``` (cart, wishlist, etc.)
   */
  abstract updateProduct(
    userId: ObjectId,
    productId: ObjectId,
    quantity?: number
  ): Promise<boolean>;
  abstract removeProduct(userId: ObjectId, productId: ObjectId): Promise<boolean>;
}
