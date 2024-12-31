import BaseController from "../../../Base/BaseController";
import FollowingService from "../Services/FollowingService";

export default class FollowingController extends BaseController {
  private readonly followingService: FollowingService;
  constructor(followingService: FollowingService) {
    super();
    this.followingService = followingService;
  }
}
