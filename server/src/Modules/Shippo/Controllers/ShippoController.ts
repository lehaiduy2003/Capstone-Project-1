import { Request, Response } from "express";
import BaseController from "../../../Base/BaseController";
import ShippoService from "../Services/ShippoService";
import { AddressCreateRequest } from "shippo";
import { validateParcels, validateShippoAddress } from "../../../libs/zod/Shippo";
import { ObjectId } from "mongodb";
export default class ShippoController extends BaseController {
  private ShippoService: ShippoService;

  constructor(ShippoService: ShippoService) {
    super();
    this.ShippoService = ShippoService;
  }

  public async createShipment(req: Request, res: Response) {
    if (!this.checkReqBody(req, res)) return;
    try {
      const { address_from, address_to, parcels } = req.body;
      // console.log("address_from", address_from);
      // console.log("address_to", address_to);

      const userId = req.body.user_id;
      const transactionId = new ObjectId(String(req.body.transaction_id));

      const addressFrom: AddressCreateRequest = validateShippoAddress(address_from);
      const addressTo: AddressCreateRequest = validateShippoAddress(address_to);

      const parcelsData = validateParcels(parcels);

      const result = await this.ShippoService.create(
        addressFrom,
        addressTo,
        parcelsData,
        userId,
        transactionId
      );
      if (result.status !== "SUCCESS") {
        res.status(400).send({ message: "Failed to create shipment" });
        return;
      }
      res.status(201).send({ success: true, data: result });
    } catch (e) {
      this.error(e, res);
    }
  }

  async createParcels(req: Request, res: Response) {
    if (!this.checkReqBody(req, res)) return;
    try {
      const { parcels } = req.body;
      // console.log(parcels);

      const userId = new ObjectId(String(req.body.user_id));
      const parcelsData = validateParcels(parcels);
      // console.log("parcelsData", parcelsData);

      const result = await this.ShippoService.createParcels(parcelsData, userId);
      if (!result) {
        res.status(400).send({ message: "Failed to create parcel" });
        return;
      }
      res.status(201).send({ success: true, data: result });
    } catch (e) {
      this.error(e, res);
    }
  }

  async findParcel(req: Request, res: Response) {
    try {
      const parcelId = req.params.id;
      const parcel = await this.ShippoService.findParcel(parcelId);
      res.status(200).send({ success: true, data: parcel });
    } catch (e) {
      this.error(e, res);
    }
  }

  async findAllParcelsByUserId(req: Request, res: Response) {
    try {
      const userId = new ObjectId(String(req.params.id));
      const parcels = await this.ShippoService.findAllParcelsByUserId(userId);
      res.status(200).send({ success: true, data: parcels });
    } catch (e) {
      this.error(e, res);
    }
  }

  public async findById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const Shippo = await this.ShippoService.findById(id);
      res.status(200).send({ Shippo });
    } catch (e) {
      this.error(e, res);
    }
  }

  public async findManyByUserId(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const Shippo = await this.ShippoService.findManyByUserId(userId);
      res.status(200).send({ Shippo });
    } catch (e) {
      this.error(e, res);
    }
  }
}
