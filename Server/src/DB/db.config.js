import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

const dbConnect = async () => {
  try {
    await prisma.$connect();
    console.log("✅ Database connected succesfully! ✅");
  } catch (error) {
    console.log("❌ Database connection failed! ❌", error);
    process.exit(1);
  }
};







export default dbConnect;
