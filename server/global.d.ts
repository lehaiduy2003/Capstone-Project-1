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
      // Firebase
      // FIREBASE_API_KEY: string;
      // FIREBASE_AUTH_DOMAIN: string;
      // FIREBASE_PROJECT_ID: string;
      // FIREBASE_STORAGE_BUCKET: string;
      // FIREBASE_MESSAGING_SENDER_ID: string;
      // FIREBASE_APP_ID: string;
      // FIREBASE_MEASUREMENT_ID: string;
    }
  }
}

export {};
