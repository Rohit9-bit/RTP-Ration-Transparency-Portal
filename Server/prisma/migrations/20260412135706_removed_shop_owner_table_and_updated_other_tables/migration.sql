/*
  Warnings:

  - You are about to drop the column `managerId` on the `distribution_center` table. All the data in the column will be lost.
  - You are about to drop the `shop_owner` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[transactionId]` on the table `grievance` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "public"."distribution_center" DROP CONSTRAINT "distribution_center_managerId_fkey";

-- DropForeignKey
ALTER TABLE "public"."grievance" DROP CONSTRAINT "grievance_commodityId_fkey";

-- DropIndex
DROP INDEX "public"."distribution_center_managerId_key";

-- AlterTable
ALTER TABLE "commodity" ADD COLUMN     "updatedAt" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "distribution_center" DROP COLUMN "managerId",
ADD COLUMN     "updatedAt" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "grievance" ADD COLUMN     "transactionId" TEXT,
ALTER COLUMN "commodityId" DROP NOT NULL,
ALTER COLUMN "expected_quantity" DROP NOT NULL,
ALTER COLUMN "actual_quantity" DROP NOT NULL;

-- AlterTable
ALTER TABLE "quota" ALTER COLUMN "month_year" DROP DEFAULT,
ALTER COLUMN "month_year" SET DATA TYPE TEXT;

-- DropTable
DROP TABLE "public"."shop_owner";

-- CreateIndex
CREATE UNIQUE INDEX "grievance_transactionId_key" ON "grievance"("transactionId");

-- AddForeignKey
ALTER TABLE "grievance" ADD CONSTRAINT "grievance_commodityId_fkey" FOREIGN KEY ("commodityId") REFERENCES "commodity"("commodity_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grievance" ADD CONSTRAINT "grievance_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "transaction_log"("transaction_id") ON DELETE SET NULL ON UPDATE CASCADE;
