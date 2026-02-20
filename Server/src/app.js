import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());

// CORS policy
app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));

import userRouter from "./routes/beneficiaryAuth.route.js";
import ownerRouter from "./routes/ownerAuth.route.js";
import transactionRouter from "./routes/transaction.route.js";
import transactionHistory from "./routes/transactionHistory.route.js";
import grievanceRouter from "./routes/grievance.route.js";
import aggregatedDataRouter from "./routes/aggregatedData.route.js";
import beneficiaryDashboardRouter from "./routes/benficiaryDashboard.route.js";
import getCenterDetails from "./routes/getCenterDetails.route.js";

// Public routes
app.use("/public", aggregatedDataRouter);

// Beneficiary routes
app.use("/beneficiary", userRouter);
app.use("/beneficiary/transaction", transactionHistory);
app.use("/grievance", grievanceRouter);
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
