import BaseController from "../../../Base/BaseController";
import FollowerService from "../Services/FollowerService";

export default class FollowerController extends BaseController {
  private readonly followerService: FollowerService;
  constructor(followerService: FollowerService) {
    super();
    this.followerService = followerService;
  }
}
