import { Request } from "express";

/**
 * ```valid id mapping: id, _id, user_id, userId, shipper_id```
 * @param body
 * @returns
 */
const getUserIdFromBody = (req: Request): string | null => {
  return (
    req.body.id ||
    req.body._id ||
    req.body.user_id ||
    req.body.userId ||
    req.body.shipper_id ||
    req.body.shipperId ||
    req.body.owner ||
    null
  );
};

export default getUserIdFromBody;
