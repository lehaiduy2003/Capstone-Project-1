import jwt from "jsonwebtoken";
import { Payload } from "../zod/Payload";

export default function decodeToken(token: string): Payload {
  try {
    const payload = jwt.decode(token);
    return payload as Payload;
  } catch (error) {
    console.error(error);
    throw new Error("cannot decode token");
  }
}
