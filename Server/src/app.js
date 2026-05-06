import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

// CORS policy
const allowedOrigins = [
  "https://rtp-ration-transparency-portal-one.vercel.app/",
  "https://rtp-ration-transparency-portal-abaq.vercel.app",
];
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    }, // Replace with your frontend URL
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());

import userRouter from "./routes/beneficiaryAuth.route.js";
import ownerRouter from "./routes/ownerAuth.route.js";
import transactionRouter from "./routes/transaction.route.js";
import transactionHistory from "./routes/transactionHistory.route.js";
import grievanceRouter from "./routes/grievance.route.js";
import aggregatedDataRouter from "./routes/aggregatedData.route.js";
import beneficiaryDashboardRouter from "./routes/benficiaryDashboard.route.js";
import getCenterDetails from "./routes/getCenterDetails.route.js";

// Test route
import testRouter from "./routes/test.route.js";
app.use("/api", testRouter);

// Public routes
app.use("/public", aggregatedDataRouter);

// Beneficiary routes
app.use("/beneficiary", userRouter);
app.use("/beneficiary/transaction", transactionHistory);
app.use("/beneficiary/grievance", grievanceRouter);
app.use("/beneficiary/dashboard", beneficiaryDashboardRouter);

// Managers routes
app.use("/manager", ownerRouter);
app.use("/manager/transaction", transactionRouter);

// distributions center endpoint
app.use("/centers", getCenterDetails);

// token checker route
import tokenCheckerRouter from "./middlewares/tokenChecker.middleware.js";
app.use("/token", tokenCheckerRouter);

export default app;
