import { model, Schema } from "mongoose";
import { Parcel } from "../../../libs/zod/model/Parcel";

const ParcelSchema: Schema<Parcel> = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: "user_profiles", required: true },
  parcel_id: { type: String, required: true },
  label: { type: String },
  extra: {
    cod: {
      amount: { type: String },
      currency: { type: String },
      paymentMethod: { type: String },
    },
    insurance: {
      amount: { type: String },
      currency: { type: String },
      content: { type: String },
      provider: { type: String },
    },
  },
  mass_unit: { type: String, required: true },
  weight: { type: String, required: true },
  distance_unit: { type: String, required: true },
  height: { type: String, required: true },
  length: { type: String, required: true },
  width: { type: String, required: true },
  metadata: { type: String, required: true },
});

ParcelSchema.index({ userId: 1, label: 1 }, { unique: true });
const parcelModel = model<Parcel>("parcels", ParcelSchema);

export default parcelModel;
