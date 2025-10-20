import { PrismaClient } from "@prisma/client";

const Client = new PrismaClient();

const dbConnect = async () => {
  try {
    await Client.$connect();
    console.log("✅ Database connected succesfully! ✅");
  } catch (error) {
    console.log("❌ Database connection failed! ❌", error);
    process.exit(1);
  }
};


export default dbConnect;
