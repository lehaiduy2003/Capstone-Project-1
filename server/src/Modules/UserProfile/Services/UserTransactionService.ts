import { ObjectId } from "mongodb";
import transactionsModel from "../../Transaction/Models/transactionsModel";

export default class UserTransactionService {
  async getUserTransactions(id: ObjectId) {
    return await transactionsModel.find({ user_id: id }).lean();
  }
  public constructor() {}
}
