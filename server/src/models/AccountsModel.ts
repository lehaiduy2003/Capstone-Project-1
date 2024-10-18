// server/models/product.js
import { Model, Schema } from "mongoose";

import BaseModel from "./init/BaseModel";

import { Account, RecyclerField } from "../libs/zod/model/Account";

const accountsSchema: Schema<Account> = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["customer", "recycler", "admin"],
    default: "customer",
  },
  createdAt: { type: Date, required: true, default: Date.now },
  updatedAt: { type: Date, required: true, default: Date.now },
  isVerified: { type: Boolean, required: true, default: false },
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active",
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
  return (
    recyclerField?.recyclingLicenseNumber ??
    (false && recyclerField?.recyclingCapacity) ??
    false
  );
}
// Create indexes
accountsSchema.index({ email: 1 }, { unique: true });
accountsSchema.index({ role: 1 });
accountsSchema.index({ createAt: 1 });

export default class AccountsModel extends BaseModel<
  AccountsModel & Model<Account>,
  Account
> {
  private readonly recyclerField?: RecyclerField;

  public constructor() {
    super("account", accountsSchema);
    this.recyclerField = this.recyclerField || {
      recyclingLicenseNumber: "",
      recyclingCapacity: 0,
    };
  }

  public async findAccountByEmail(email: string): Promise<Account | null> {
    const result: Account | null = await this.findByUnique("email", email);
    return result;
  }
}
