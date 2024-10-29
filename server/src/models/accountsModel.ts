import { model, Schema } from "mongoose";
import { Account } from "../libs/zod/model/Account";
import { RecyclerField } from "../libs/zod/Properties/RecyclerField";

const accountsSchema: Schema<Account> = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["customer", "recycler", "admin"],
    default: "customer",
  },
  createdAt: { type: Date, required: true },
  updatedAt: { type: Date, required: true },
  isVerified: { type: Boolean, required: true },
  status: {
    type: String,
    enum: ["active", "inactive"],
  },
  recyclerField: {
    recyclingLicenseNumber: { type: String },
    recyclingCapacity: { type: Number },
  },
});

// Pre-save hook to check account type and conditionally add fields
accountsSchema.pre("save", function (next) {
  if (this.role !== "recycler") {
    return next();
  }

  if (!isValidRecyclerField(this.recyclerField as RecyclerField)) {
    return next(new Error("recyclerField is required when role is recycler"));
  }

  next();
});

function isValidRecyclerField(recyclerField: RecyclerField) {
  return !!recyclerField?.license;
}

// Create indexes
accountsSchema.index({ email: 1 }, { unique: true });
accountsSchema.index({ role: 1 });
accountsSchema.index({ createAt: 1 });

const accountsModel = model<Account>("accounts", accountsSchema);

export default accountsModel;
