import { Donation } from "../../../libs/zod/model/Donation";
import donationsModel from "../Models/donationsModel";
import QRCode from "qrcode";
import { ObjectId } from "mongodb";
import Cloudinary from "../../../configs/Cloudinary";
export default class DonationService {
  async create(data: Partial<Donation>) {
    // create donation
    try {
      const donation = new donationsModel(data);
      await donation.save();
      return donation.toObject();
    } catch (error) {
      throw error;
    }
  }

  public async generateQRCode(
    userId: ObjectId,
    campaignId: ObjectId,
    content: string,
    quantity: number,
    weight: number
  ) {
    const statusUrl = `${process.env.API_URL}/campaigns/donate?userId=${String(
      userId
    )}&campaignId=${String(campaignId)}&content=${content}&quantity=${quantity}&weight=${weight}`;
    const qrCode = await QRCode.toDataURL(statusUrl);
    const base64Data = qrCode.replace(/^data:image\/png;base64,/, "");
    const uploadResult = await Cloudinary.uploader.upload(`data:image/png;base64,${base64Data}`, {
      folder: "qrcodes",
      public_id: `${userId}-${campaignId}`,
      overwrite: true,
    });
    return uploadResult.secure_url;
  }
}
