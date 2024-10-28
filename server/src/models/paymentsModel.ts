import {model, Schema} from "mongoose";
import {Payment} from "../libs/zod/model/Payment";

const paymentsSchema: Schema<Payment> = new Schema({
    user_id: {type: Schema.Types.ObjectId, required: true},
    stripeId: {type: String, required: true},
    createdAt: {type: Date},
});

paymentsSchema.index({type: 1});
paymentsSchema.index({account: 1});
paymentsSchema.index({date: 1});

const paymentsModel = model<Payment>("payments", paymentsSchema);

export default paymentsModel;
