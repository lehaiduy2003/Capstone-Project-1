import { exec } from "child_process";
import dotenv from "dotenv";
dotenv.config();

const cloudDbUrl = process.env.DATABASE_URL;
const localDbUrl = "mongodb://localhost:27017/EcoTrade";

export const backupDatabase = () => {
  console.log("Start scheduling the backup job");
  const timestamp = new Date()
    .toISOString()
    .replace(/T/, "_")
    .replace(/:/g, "-")
    .replace(/\..+/, "");
  const backupPath = `./backup/${timestamp}`;

  // Dump the cloud database
  exec(
    `mongodump --uri="${cloudDbUrl}" --out=${backupPath}`,
    (err: Error | null, stdout: string, stderr: string) => {
      if (err) {
        console.error(`Error during mongodump: ${err}`);
        console.error(`stderr: ${stderr}`);
        return;
      }
      console.log(`Backup completed: ${stdout}`);
      console.error(`stderr: ${stderr}`);

      // Restore the backup to the local database
      exec(
        `mongorestore --uri="${localDbUrl}" --nsInclude="EcoTrade.*" --drop ${backupPath}/EcoTrade`,
        (err: Error | null, stdout: string, stderr: string) => {
          if (err) {
            console.error(`Error during mongorestore: ${err}`);
            console.error(`stderr: ${stderr}`);
            return;
          }
          console.log(`Restore completed: ${stdout}`);
          console.error(`stderr: ${stderr}`);
        }
      );
    }
  );
};
