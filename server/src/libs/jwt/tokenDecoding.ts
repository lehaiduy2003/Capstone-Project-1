import { decode } from "jsonwebtoken";
import { Payload } from "../zod/Payload";

const decodeToken = (token: string): Payload => {
  try {
    const payload = decode(token);
    return payload as Payload;
  } catch (error) {
    console.error(error);
    throw new Error("cannot decode token");
  }
};

export default decodeToken;
