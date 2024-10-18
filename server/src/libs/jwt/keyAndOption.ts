import dotenv from "dotenv";
import { SignOptions } from "jsonwebtoken";

dotenv.config();

export const SECRET_KEY = String(process.env.SECRET_KEY);

export const commonOptions: SignOptions = {
  algorithm: "HS512",
  issuer: "Capstone-project-1",
  audience: "EcoTrade",
};
