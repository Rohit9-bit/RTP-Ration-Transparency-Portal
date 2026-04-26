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

import cron from "node-cron";
import { generateMonthlyQuota } from "./utils/generateMonthlyQuota.js";
import { generateMonthlyShopStockLedger } from "./utils/generateMonthlyShopStockLedger.js";
import { getBeneficiaryEntitlements } from "./utils/getBeneficiaryEntitlement.js";
// Schedule the job to run at 00:05 (5 minutes past midnight) on the 1st day of every month
// cron.schedule(
//   "* * * * *",
//   async () => {
//     console.log("Running monthly quota and stock-ledger generation job...");
//     try {
//       await generateMonthlyQuota().catch((error) => {
//         throw new Error(error);
//       });
//       await generateMonthlyShopStockLedger().catch((error) => {
//         throw new Error(error);
//       });
//       await getBeneficiaryEntitlement().catch((error) => {
//         throw new Error(error);
//       });

//       console.log("Job completed successfully.");
//     } catch (error) {
//       console.error(
//         "Error in monthly quota and stock-ledger generation job:",
//         error,
//       );
//     }
//   },
//   {
//     scheduled: true,
//     timezone: "Asia/Kolkata", // Or your relevant timezone
//   },
// );
