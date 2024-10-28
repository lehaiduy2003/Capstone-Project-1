import twilioClient from "./config";

import dotenv from "dotenv";
dotenv.config();

const sendPhoneOtp = async (identifier: string): Promise<boolean> => {
  const sent = await twilioClient.verify.v2.services(process.env.SERVICE_SID as string).verifications.create({
    to: identifier,
    channel: "sms",
  });
  return sent.status === "pending" ? true : false;
};

export default sendPhoneOtp;
