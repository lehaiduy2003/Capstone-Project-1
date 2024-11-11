import ProductService from "../../Product/Services/ProductService";
import { ObjectId } from "mongodb";
import userProfilesModel from "../Models/userProfilesModel";
import UserProductService from "./init/UserProductService";
import { ProductDTO } from "../../../libs/zod/dto/ProductDTO";
import { validateWishListDTO } from "../../../libs/zod/dto/WishListDTO";

export default class WishListService extends UserProductService {
  constructor() {
    super(new ProductService());
  }

  override async updateProduct(userId: ObjectId, productId: ObjectId): Promise<boolean> {
    const { user, product } = await this.checkAction(userId, productId);

    // Check if product is already in wish list (use some() and equals() instead of includes())
    // ObjectId is a class, so we need to use the equals() method to compare
    if (user.wish_list.some((id) => id.equals(product._id)))
      throw new Error("Product already in wish list");

    // Favorite products should not need quantity
    if ("quantity" in product) {
      delete product["quantity"];
    }

    const addedStatus = await userProfilesModel.findOneAndUpdate(
      { _id: user._id },
      { $addToSet: { wish_list: product._id } },
      { new: true }
    );

    if (!addedStatus) return false;

    return addedStatus.wish_list.some((id) => id.equals(product._id));
  }

  override async removeProduct(userId: ObjectId, productId: ObjectId) {
    const { user, product } = await this.checkAction(userId, productId);

    const removedStatus = await userProfilesModel.findOneAndUpdate(
      { _id: user._id },
      { $pull: { wish_list: product._id } },
      { new: true }
    );

    if (!removedStatus) return false;
    return removedStatus.wish_list.every((id) => !id.equals(product._id));
  }

  override async getProducts(userId: ObjectId): Promise<Partial<ProductDTO>[]> {
    const user = await this.findUser(userId);
    return validateWishListDTO(user.wish_list);
  }
}
