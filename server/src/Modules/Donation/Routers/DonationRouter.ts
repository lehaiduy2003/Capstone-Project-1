import BaseRouter from "../../../Base/BaseRouter";
import { Role } from "../../../libs/zod/enums/Role";
import { checkTokens } from "../../../middlewares/authenticationMiddleware";
import authorizeUser from "../../../middlewares/authorizationMiddleware";
import DonationController from "../Controllers/DonationController";
import DonationService from "../Services/DonationService";

class DonationRouter extends BaseRouter {
  private readonly donationController: DonationController;

  constructor(donationController: DonationController) {
    super();
    this.donationController = donationController;
    this.initRoutes();
  }

  public initRoutes(): void {
    this.router.post(
      "/",
      checkTokens,
      authorizeUser([Role.Enum.customer]),
      this.donationController.create.bind(this.donationController)
    );
    this.router.post(
      "/qrcode",
      checkTokens,
      authorizeUser([Role.Enum.customer]),
      this.donationController.generateQRCode.bind(this.donationController)
    );
  }
}

// /donations
const createDonationRouter = (): DonationRouter => {
  const donationService = new DonationService();
  const donationController = new DonationController(donationService);

  return new DonationRouter(donationController);
};

export default createDonationRouter;
