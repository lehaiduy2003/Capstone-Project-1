declare global {
  namespace NodeJS {
    interface ProcessEnv {
      SECRET_KEY: string;
      DATABASE_URL: string;
      STRIPE_SECRET_KEY: string;
      NODE_ENV: "development" | "production" | "test";
      PORT: string;
      HOST: string;
      REDIS_HOST: string;
      REDIS_PORT: string;
      REDIS_PASSWORD: string;
      API_URL: string;
      // Ngrok
      NGROK_DOMAIN: string;
      NGROK_AUTH_TOKEN: string;
      // Nodemailer
      EMAIL: string;
      NODEMAILER_PASSWORD: string;
      // Twilio
      ACCOUNT_SID: string;
      AUTH_TOKEN: string;
      PHONE_NUMBER: string;
      SERVICE_SID: string;
      // Cloudinary
      CLOUDINARY_API_KEY: string;
      CLOUDINARY_API_SECRET: string;
      CLOUDINARY_UPLOAD_PRESET: string;
    }
  }
}

export {};
