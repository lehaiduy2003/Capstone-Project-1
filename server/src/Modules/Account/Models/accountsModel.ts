import { model, Schema } from "mongoose";
import { Account } from "../../../libs/zod/model/Account";
import updateTimestamp from "../../../utils/updateTimestamp";

const accountsSchema: Schema<Account> = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["customer", "recycler", "admin"],
  },
  created_at: { type: Date, required: true },
  updated_at: { type: Date, required: true },
  is_verified: { type: Boolean, required: true },
  status: {
    type: String,
    enum: ["active", "inactive"],
  },
});

accountsSchema.pre("findOneAndUpdate", updateTimestamp);
accountsSchema.pre("updateOne", updateTimestamp);

// Create indexes
accountsSchema.index({ email: 1 }, { unique: true });
accountsSchema.index({ role: 1 });
accountsSchema.index({ create_at: 1 });

const accountsModel = model<Account>("accounts", accountsSchema);

export default accountsModel;
