import {model, Schema} from "mongoose";
import {RecycleCampaign} from "../libs/zod/model/RecyclingCampaign";

const recycleCampaignsSchema: Schema<RecycleCampaign> = new Schema({
    name: {type: String, required: true},
    img: {type: String, required: true},
    description_content: {type: String},
    description_imgs: [{type: String}],
    guide: {type: String},
    location: [{type: String, required: true}],
    recycledWeight: {type: Number, required: true},
    recycledAmount: {type: Number, required: true},
    participants: {type: Number, required: true},
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now},
    owner: {
        type: Schema.Types.ObjectId,
        ref: "UserProfiles",
        required: true,
    },
    status: {
        type: Boolean,
        required: true,
        default: true,
    },
});

recycleCampaignsSchema.index({name: 1});
recycleCampaignsSchema.index({createAt: 1});
recycleCampaignsSchema.index({userId: 1});

const recycleCampaignsModel = model<RecycleCampaign>("recycle_campaigns", recycleCampaignsSchema);

export default recycleCampaignsModel;
