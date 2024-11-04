import UserProfileService from "./UserProfileService";
import ProductService from "../../Product/Services/ProductService";
import { ObjectId } from "mongodb";
import {
  ProductDTO,
  validateProductDTO,
} from "../../../libs/zod/dto/ProductDTO";
import userProfilesModel from "../Models/userProfilesModel";
import { UserProfileDTO } from "../../../libs/zod/dto/UserProfileDTO";

export default class FavoriteProductService {
  private readonly userProfileService: UserProfileService;
  private readonly productService: ProductService;

  constructor(
    userProfileService: UserProfileService,
    productService: ProductService,
  ) {
    this.userProfileService = userProfileService;
    this.productService = productService;
  }

  async getUser(userId: ObjectId): Promise<UserProfileDTO> {
    const user = await this.userProfileService.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  }

  async getProduct(productId: ObjectId): Promise<ProductDTO> {
    const product = await this.productService.findById(productId);

    if (!product) {
      throw new Error("Product not found");
    }

    return validateProductDTO(product);
  }

  async addProduct(userId: ObjectId, productId: ObjectId): Promise<boolean> {
    const user = await this.getUser(userId);
    const product = await this.getProduct(productId);

    // Favorite products should not need quantity
    if ("quantity" in product) {
      delete product["quantity"];
    }
    const updatedStatus = await userProfilesModel.findOneAndUpdate(
      { _id: user._id },
      { $addToSet: { likes: product } },
      { new: true },
    );

    if (!updatedStatus) return false;

    return updatedStatus.likes.includes(product);
  }

  async removeProduct(userId: ObjectId, productId: ObjectId) {
    const user = await this.getUser(userId);
    const product = await this.getProduct(productId);

    const updatedStatus = await userProfilesModel.findOneAndUpdate(
      { _id: user._id },
      { $pull: { likes: { _id: product._id } } },
      { new: true },
    );

    if (!updatedStatus) return false;

    return !updatedStatus.likes.some((likedProduct) =>
      likedProduct._id.equals(product._id),
    );
  }
}
