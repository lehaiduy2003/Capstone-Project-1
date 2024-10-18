import AccountService from "../AccountService";
import AuthService from "../AuthService";
import BaseService from "./BaseService";
import PaymentService from "../PaymentService";
import ProductService from "../ProductService";
import TransactionService from "../TransactionService";
import UserProfileService from "../UserProfileService";

export default class ServiceFactory {
  static createService(type: string): BaseService<any, any> {
    switch (type) {
      case "user":
        return new UserProfileService();
      case "product":
        return new ProductService();
      case "account":
        return new AccountService();
      case "transaction":
        return new TransactionService();
      case "payment":
        return new PaymentService();
      case "auth":
        return AuthService.getInstance();
      default:
        throw new Error("Unknown service type");
    }
  }
}
