import dotenv from "dotenv";
dotenv.config();
import dbConnect from "./DB/db.config.js";
import app from "./app.js";

const port = process.env.PORT;

const server = async () => {
  try {
    app.listen(port || 8000, () => {
      console.log(`✅ Server is running on port ${port} ✅`);
    });
  } catch (error) {
    console.log("❌ Error connectiong Server! ❌", error);
  }
};

await server();
dbConnect();

import { generateMonthlyQuota } from "./utils/generateMonthlyQuota.js";
import cron from "node-cron";


// Schedule the job to run at 00:05 (5 minutes past midnight) on the 1st day of every month
cron.schedule('5 0 1 * *', async () => {
  console.log('Running monthly quota generation job...');
  try {
    await generateMonthlyQuota();
    console.log('Monthly quota generation job completed successfully.');
  } catch (error) {
    console.error('Error in monthly quota generation job:', error);
  }
}, {
  scheduled: true,
  timezone: "Asia/Kolkata" // Or your relevant timezone
});


