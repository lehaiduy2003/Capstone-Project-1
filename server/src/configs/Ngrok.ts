import Connection from "./Connection";
import ngrok from "@ngrok/ngrok";

import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

class Ngrok extends Connection {
  private static instance: Ngrok;
  public static getInstance(): Ngrok {
    if (!Ngrok.instance) {
      Ngrok.instance = new Ngrok();
    }
    return Ngrok.instance;
  }
  public async connect(): Promise<void> {
    try {
      await ngrok.forward({
        addr: Number(process.env.PORT),
        domain: process.env.NGROK_DOMAIN,
        authtoken: process.env.NGROK_AUTH_TOKEN,
      });
    } catch (err) {
      console.error("Error starting ngrok:", err);
    }
  }
  public async close(): Promise<void> {
    if (ngrok) {
      await ngrok.kill();
      console.log("ngrok tunnel closed");
    }
  }
}

const ngrokClient = Ngrok.getInstance();

export { ngrokClient };
