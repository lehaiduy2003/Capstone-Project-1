import { useState } from "react";

const useSendOtp = () => {
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState(null);

  const sendOtp = async (email, type = "activate") => {
    setIsSending(true);
    setError(null);

    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/otp/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          identifier: email,
          type,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to send OTP");
      }

      console.log("OTP sent successfully");
      return true;
    } catch (err) {
      console.error("Error sending OTP:", err);
      setError(err.message);
      return false;
    } finally {
      setIsSending(false);
    }
  };

  return { sendOtp };
};

export default useSendOtp;
