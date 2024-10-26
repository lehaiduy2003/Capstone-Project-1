import dotenv from "dotenv";
import { createTransport } from "nodemailer";
dotenv.config();

const transporter = createTransport({
  service: "gmail", // can be any email service
  auth: {
    user: process.env.EMAIL,
    pass: process.env.NODEMAILER_PASSWORD,
  },
});

export default transporter;
