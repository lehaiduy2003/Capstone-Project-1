import otpGenerator from "otp-generator";

const otp: string = otpGenerator.generate(6, {
  upperCaseAlphabets: false,
  specialChars: false,
  lowerCaseAlphabets: false,
  digits: true,
});

export default otp;
