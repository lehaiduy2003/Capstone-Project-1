import admin from "firebase-admin";

import dotenv from "dotenv";
dotenv.config();

import serviceAccount from "../../ecotrade-1c694-firebase-adminsdk-je0py-45bc7fdd01.json";

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
});

const bucket = admin.storage().bucket();
export { bucket };
