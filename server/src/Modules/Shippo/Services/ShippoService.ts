import dotenv from "dotenv";
import { DistanceUnitEnum, Shippo, WeightUnitEnum } from "shippo";
import ITrackingService from "./Init/ITrackingService";
import { Address } from "../../../libs/zod/Address";

dotenv.config();

const shippo = new Shippo({ apiKeyHeader: process.env.SHIPPO_API_KEY });

export default class ShippoService implements ITrackingService {
  async createDelivery(
    addressFrom: Address,
    addressTo: Address,
  ): Promise<void> {
    const shipment = await shippo.shipments.create({
      addressFrom: addressFrom,
      addressTo: addressTo,
      parcels: [
        {
          length: "5",
          width: "5",
          height: "5",
          distanceUnit: DistanceUnitEnum.Mm, // millimeter
          weight: "2",
          massUnit: WeightUnitEnum.Kg, // kilogram
        },
      ],
    });
    console.log(shipment);
  }
}
