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
