import express from "express";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());

import userRouter from "./routes/beneficiaryAuth.route.js";
import ownerRouter from "./routes/ownerAuth.route.js";
import transactionRouter from "./routes/transaction.route.js";


app.use("/beneficiary", userRouter);
app.use("/manager", ownerRouter);
app.use("/transaction", transactionRouter);



export default app;
