import ProductService from "../../Product/Services/ProductService";
import { ObjectId } from "mongodb";
import userProfilesModel from "../Models/userProfilesModel";
import UserProductService from "./init/UserProductService";
import { ProductDTO, validateProductDTO } from "../../../libs/zod/dto/ProductDTO";

interface IWishList {
  data: ProductDTO[];
}

export default class WishListService extends UserProductService {
  constructor() {
    super(new ProductService());
  }

  private async getDetailsFromWishList(userId: ObjectId, products: ObjectId[]) {
    let data = [];
    if (products.length === 0) return { data: [] };
    // Fetch all product details concurrently
    const productDetailsPromises = products.map((product) =>
      this.getProductService().findById(product)
    );
    const productDetailsArray = await Promise.all(productDetailsPromises);

    for (let i = 0; i < products.length; i++) {
      const productDetails = productDetailsArray[i];
      if (!productDetails) {
        // Remove invalid product from the wishlist
        await this.removeProduct(userId, products[i]); // products[i] is the _id of the product
        continue; // Skip invalid product
      }
      data.push(validateProductDTO(productDetails));
    }
    return { data };
  }

  override async getProducts(userId: ObjectId): Promise<IWishList> {
    const user = await this.findUser(userId);
    return await this.getDetailsFromWishList(userId, user.wish_list);
  }

  override async updateProduct(userId: ObjectId, productId: ObjectId): Promise<IWishList> {
    const user = await this.findUser(userId);
    const product = await this.findProduct(productId);
    // Check if product is already in wish list (use some() and equals() instead of includes())
    // ObjectId is a class, so we need to use the equals() method to compare
    if (user.wish_list.some((id) => id.equals(product._id)))
      throw new Error("Product already in wish list");

    const addedStatus = await userProfilesModel.findOneAndUpdate(
      { _id: user._id },
      { $addToSet: { wish_list: product._id } },
      { new: true }
    );

    if (!addedStatus) throw new Error("Failed to add product");

    return await this.getDetailsFromWishList(userId, addedStatus.wish_list);
  }

  override async removeProduct(userId: ObjectId, productId: ObjectId) {
    const removedStatus = await userProfilesModel.findOneAndUpdate(
      { _id: userId._id },
      { $pull: { wish_list: productId } },
      { new: true }
    );

    if (!removedStatus) throw new Error("Failed to remove product from wish list");
    return await this.getDetailsFromWishList(userId, removedStatus.wish_list);
  }

  override async setProducts(
    userId: ObjectId,
    products: Partial<ProductDTO>[]
  ): Promise<IWishList> {
    const user = await this.findUser(userId);
    const productIds = products.map((product) => product._id);

    const updatedStatus = await userProfilesModel.findOneAndUpdate(
      { _id: user._id },
      { wish_list: productIds },
      { new: true }
    );

    if (!updatedStatus) throw new Error("Failed to update wish list");
    return await this.getDetailsFromWishList(userId, updatedStatus.wish_list);
  }
}
