import dotenv from "dotenv";
dotenv.config();

const mailOptions = (identifier: string, otp: string) => {
  return {
    from: process.env.EMAIL,
    to: identifier,
    subject: "Your OTP Code",
    text: `Your OTP is: ${otp}`,
  };
};

export default mailOptions;
