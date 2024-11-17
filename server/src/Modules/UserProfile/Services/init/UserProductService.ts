import { ObjectId } from "mongodb";
import userProfilesModel from "../../Models/userProfilesModel";
import { UserProfile } from "../../../../libs/zod/model/UserProfile";
import ProductService from "../../../Product/Services/ProductService";
import { ProductDTO, validateProductDTO } from "../../../../libs/zod/dto/ProductDTO";
import IInteractUserProduct from "./IInteractUserProduct";
import SessionService from "../../../../Base/SessionService";
import { ClientSession } from "mongoose";

export default abstract class UserProductService
  extends SessionService
  implements IInteractUserProduct
{
  private readonly productService: ProductService;

  protected constructor(productService: ProductService) {
    super();
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
    }
  }

  checkForDuplicateProducts(products: Partial<ProductDTO>[]): boolean {
    const productIds = products.map((product) => product._id?.toString());
    const uniqueProductIds = new Set(productIds);
    return productIds.length !== uniqueProductIds.size;
  }
  // Get the list of products that user interacted with
  abstract setProducts(userId: ObjectId, products: Partial<ProductDTO>[]): Promise<object>; // It can be cart, wishlist, etc.
  protected abstract getProducts(userId: ObjectId): Promise<object>; // It can be cart, wishlist, etc.
  /**
   * @param userId - The user id
   * @param productId - The product id
   * @param quantity - The quantity of the product (optional for wishlist, favorite, etc.)
   * @returns {Promise<boolean>} The result of modified ```the user's product list``` (cart, wishlist, etc.)
   */
  abstract updateProduct(userId: ObjectId, productId: ObjectId, quantity?: number): Promise<object>;
  abstract removeProduct(userId: ObjectId, productId: ObjectId): Promise<object>;
}
