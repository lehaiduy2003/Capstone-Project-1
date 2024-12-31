import { AddressCreateRequest, ShipmentPaginatedList, Shippo } from "shippo";
import dotenv from "dotenv";
import { ObjectId } from "mongodb";
import parcelModel from "../Models/ParcelsModel";
import { ShippoParcel } from "../../../libs/zod/Shippo";
import transactionsModel from "../../Transaction/Models/transactionsModel";
dotenv.config();
const shippo = new Shippo({ apiKeyHeader: `ShippoToken ${process.env.SHIPPO_API_KEY as string}` });

export default class ShippoService {
  async findParcel(parcelId: string) {
    try {
      return await parcelModel.findOne({ parcel_id: parcelId });
    } catch (error) {
      throw error;
    }
  }
  private checkDuplicateParcel = async (label: string, userId: ObjectId) => {
    try {
      return await parcelModel.findOne({ label, user_id: userId }).lean();
    } catch (error) {
      throw error;
    }
  };
  async createParcels(parcelsData: ShippoParcel, userId: ObjectId) {
    try {
      if (parcelsData.label) {
        if (await this.checkDuplicateParcel(parcelsData.label, userId)) {
          throw new Error("Parcel already exists");
        }
      }
      const parcel = await shippo.parcels.create({
        extra: parcelsData.extra,
        massUnit: "kg",
        weight: parcelsData.weight,
        distanceUnit: "cm",
        height: parcelsData.height,
        length: parcelsData.length,
        width: parcelsData.width,
        metadata: `User ID: ${userId}`,
      });
      // console.log(parcels);

      const data = new parcelModel({
        user_id: userId,
        label: parcelsData.label,
        extra: parcel.extra,
        parcel_id: parcel.objectId,
        mass_unit: parcel.massUnit,
        weight: parcel.weight,
        distance_unit: parcel.distanceUnit,
        height: parcel.height,
        length: parcel.length,
        width: parcel.width,
        metadata: `User ID: ${userId}`,
      });
      await data.save();
      return parcel;
    } catch (error) {
      throw error;
    }
  }
  public constructor() {}

  async findAllParcelsByUserId(userId: ObjectId) {
    try {
      const data = await parcelModel.find({ user_id: userId });
      return data;
    } catch (error) {
      throw error;
    }
  }

  public async create(
    addressFrom: AddressCreateRequest,
    addressTo: AddressCreateRequest,
    parcel: ShippoParcel,
    userId: string,
    transactionId: ObjectId
  ) {
    try {
      const transaction = await shippo.shipments.create({
        addressFrom: addressFrom,
        addressTo: addressTo,
        parcels: parcel.objectId ? [parcel.objectId] : [parcel],
        metadata: `User ID: ${userId}`,
        async: false,
      });
      await transactionsModel.findOneAndUpdate(
        { _id: transactionId },
        { transaction_status: "transporting" }
      );
      return transaction;
    } catch (error) {
      throw error;
    }
  }

  async findById(id: string) {
    try {
      return await shippo.shipments.get(id);
    } catch (error) {
      throw error;
    }
  }
  async findManyByUserId(userId: string) {
    try {
      const data: ShipmentPaginatedList = await shippo.shipments.list({});
      if (!data.results) {
        return [];
      }
      return data.results.filter((shipment) => shipment.metadata === `User ID: ${userId}`);
    } catch (error) {
      throw error;
    }
  }
}
