import { ObjectId } from "mongodb";
import userProfilesModel from "../../Models/userProfilesModel";
import { UserProfile } from "../../../../libs/zod/model/UserProfile";
import ProductService from "../../../Product/Services/ProductService";
import { ProductDTO, validateProductDTO } from "../../../../libs/zod/dto/ProductDTO";
import IInteractUserProduct from "./IInteractUserProduct";

export default abstract class UserProductService implements IInteractUserProduct {
  private readonly productService: ProductService;

  protected constructor(productService: ProductService) {
    this.productService = productService;
  }

  async findUser(userId: ObjectId): Promise<UserProfile> {
    const user = await userProfilesModel.findOne({ _id: userId }).lean();

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  }

  async findProduct(productId: ObjectId) {
    const product = await this.productService.findById(productId);
    // console.log(product);

    if (!product || !product.status) {
      throw new Error("Product not found or inactive");
    }
    return validateProductDTO(product);
  }

  // Get the list of products that user interacted with
  abstract getProducts(userId: ObjectId): Promise<ProductDTO[]>;
  abstract addProduct(userId: ObjectId, productId: ObjectId, quantity: number): Promise<boolean>;
  abstract removeProduct(userId: ObjectId, productId: ObjectId): Promise<boolean>;
}
