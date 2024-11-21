import dotenv from "dotenv";
import { AddressCreateRequest, DistanceUnitEnum, Shippo, WeightUnitEnum } from "shippo";
import ITrackingService from "./Init/ITrackingService";
import { Address } from "../../../libs/zod/Address";
import { Transaction } from "../../../libs/zod/model/Transaction";

dotenv.config();

const shippo = new Shippo({ apiKeyHeader: process.env.SHIPPO_API_KEY });

export default class ShippoService implements ITrackingService {
  async createDelivery(order: Transaction) {
    return true;
  }
}
