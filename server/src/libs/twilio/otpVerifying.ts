// import twilioClient from "./config";
// import dotenv from "dotenv";
// dotenv.config();

// const verifyTwilioOTP = async (otp: string, phone: string) => {
//   const verificationCheck = await twilioClient.verify.v2
//     .services(process.env.SERVICE_SID as string)
//     .verificationChecks.create({
//       to: phone,
//       code: otp,
//     });

//   return verificationCheck.status === "approved" ? true : false;
// };

// export default verifyTwilioOTP;
