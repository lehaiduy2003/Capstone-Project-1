import AccountsModel from "../AccountsModel";
import ActivitiesModel from "../ActivitiesModel";
import AuthModel from "../AuthModel";
import BaseModel from "./BaseModel";
import PaymentsModel from "../PaymentsModel";
import ProductsModel from "../ProductsModel";
import RecycleCampaignsModel from "../RecycleCampaignsModel";
import TransactionsModel from "../TransactionsModel";
import UserProfilesModel from "../UserProfilesModel";

/**
 * ModelFactory.ts
 * @description: This file defines a factory class `ModelFactory` that creates instances of various Mongoose models based on a given type.
 */
export default class ModelFactory {
  /**
   * Naming rule:
   * `no upper case`
   * `single word only`
   *
   * Creates an instance of a model based on the provided type.
   * @param type - The type of the model to create.
   * @returns An instance of the corresponding model.
   */
  public static createModel(type: string): BaseModel<any, any> {
    switch (type) {
      case "account":
        return new AccountsModel();
      case "user":
        return new UserProfilesModel();
      case "product":
        return new ProductsModel();
      case "transaction":
        return new TransactionsModel();
      case "activities":
        return new ActivitiesModel();
      case "payment":
        return new PaymentsModel();
      case "recycle":
        return new RecycleCampaignsModel();
      case "auth":
        return AuthModel.getInstance(); // stateless, so use singleton
      default:
        throw new Error(`Model type "${type}" is not recognized.`);
    }
  }
}
