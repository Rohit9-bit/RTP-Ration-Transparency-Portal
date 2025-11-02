/*
  Warnings:

  - You are about to drop the column `ledgerId` on the `commodity` table. All the data in the column will be lost.
  - You are about to drop the column `quotaId` on the `commodity` table. All the data in the column will be lost.
  - You are about to drop the column `beneficieryId` on the `grieviance` table. All the data in the column will be lost.
  - You are about to drop the column `beneficieryId` on the `quota` table. All the data in the column will be lost.
  - You are about to drop the column `beneficieryId` on the `transaction_log` table. All the data in the column will be lost.
  - You are about to drop the `beneficiery` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[commodity_id]` on the table `commodity` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[center_id]` on the table `distribution_center` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[grieviance_id]` on the table `grieviance` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[quota_id]` on the table `quota` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[beneficiaryId,commodityId,month_year]` on the table `quota` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[manager_id]` on the table `shop_owner` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[ledger_id]` on the table `shop_stock_ledger` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[transaction_id]` on the table `transaction_log` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `beneficiaryId` to the `grieviance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `beneficiaryId` to the `quota` table without a default value. This is not possible if the table is not empty.
  - Added the required column `commodityId` to the `quota` table without a default value. This is not possible if the table is not empty.
  - Added the required column `commodityId` to the `shop_stock_ledger` table without a default value. This is not possible if the table is not empty.
  - Added the required column `beneficiaryId` to the `transaction_log` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."beneficiery" DROP CONSTRAINT "beneficiery_centerId_fkey";

-- DropForeignKey
ALTER TABLE "public"."commodity" DROP CONSTRAINT "commodity_ledgerId_fkey";

-- DropForeignKey
ALTER TABLE "public"."commodity" DROP CONSTRAINT "commodity_quotaId_fkey";

-- DropForeignKey
ALTER TABLE "public"."grieviance" DROP CONSTRAINT "grieviance_beneficieryId_fkey";

-- DropForeignKey
ALTER TABLE "public"."quota" DROP CONSTRAINT "quota_beneficieryId_fkey";

-- DropForeignKey
ALTER TABLE "public"."transaction_log" DROP CONSTRAINT "transaction_log_beneficieryId_fkey";

-- DropIndex
DROP INDEX "public"."commodity_quotaId_key";

-- DropIndex
DROP INDEX "public"."quota_beneficieryId_key";

-- AlterTable
ALTER TABLE "commodity" DROP COLUMN "ledgerId",
DROP COLUMN "quotaId";

-- AlterTable
ALTER TABLE "grieviance" DROP COLUMN "beneficieryId",
ADD COLUMN     "beneficiaryId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "quota" DROP COLUMN "beneficieryId",
ADD COLUMN     "beneficiaryId" TEXT NOT NULL,
ADD COLUMN     "commodityId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "shop_stock_ledger" ADD COLUMN     "commodityId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "transaction_log" DROP COLUMN "beneficieryId",
ADD COLUMN     "beneficiaryId" TEXT NOT NULL;

-- DropTable
DROP TABLE "public"."beneficiery";

-- CreateTable
CREATE TABLE "beneficiary" (
    "beneficiary_id" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone_no" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "family_size" INTEGER NOT NULL,
    "state" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "ration_card_no" TEXT NOT NULL,
    "is_active" BOOLEAN DEFAULT true,
    "security_PIN" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "centerId" TEXT NOT NULL,

    CONSTRAINT "beneficiary_pkey" PRIMARY KEY ("beneficiary_id")
);




-- CreateIndex
CREATE UNIQUE INDEX "beneficiary_beneficiary_id_key" ON "beneficiary"("beneficiary_id");

-- CreateIndex
CREATE UNIQUE INDEX "beneficiary_ration_card_no_key" ON "beneficiary"("ration_card_no");

-- CreateIndex
CREATE UNIQUE INDEX "commodity_commodity_id_key" ON "commodity"("commodity_id");

-- CreateIndex
CREATE UNIQUE INDEX "distribution_center_center_id_key" ON "distribution_center"("center_id");

-- CreateIndex
CREATE UNIQUE INDEX "grieviance_grieviance_id_key" ON "grieviance"("grieviance_id");

-- CreateIndex
CREATE UNIQUE INDEX "quota_quota_id_key" ON "quota"("quota_id");

-- CreateIndex
CREATE UNIQUE INDEX "quota_beneficiaryId_commodityId_month_year_key" ON "quota"("beneficiaryId", "commodityId", "month_year");

-- CreateIndex
CREATE UNIQUE INDEX "shop_owner_manager_id_key" ON "shop_owner"("manager_id");

-- CreateIndex
CREATE UNIQUE INDEX "shop_stock_ledger_ledger_id_key" ON "shop_stock_ledger"("ledger_id");

-- CreateIndex
CREATE UNIQUE INDEX "transaction_log_transaction_id_key" ON "transaction_log"("transaction_id");

-- AddForeignKey
ALTER TABLE "beneficiary" ADD CONSTRAINT "beneficiary_centerId_fkey" FOREIGN KEY ("centerId") REFERENCES "distribution_center"("center_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quota" ADD CONSTRAINT "quota_beneficiaryId_fkey" FOREIGN KEY ("beneficiaryId") REFERENCES "beneficiary"("beneficiary_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quota" ADD CONSTRAINT "quota_commodityId_fkey" FOREIGN KEY ("commodityId") REFERENCES "commodity"("commodity_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaction_log" ADD CONSTRAINT "transaction_log_beneficiaryId_fkey" FOREIGN KEY ("beneficiaryId") REFERENCES "beneficiary"("beneficiary_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shop_stock_ledger" ADD CONSTRAINT "shop_stock_ledger_commodityId_fkey" FOREIGN KEY ("commodityId") REFERENCES "commodity"("commodity_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grieviance" ADD CONSTRAINT "grieviance_beneficiaryId_fkey" FOREIGN KEY ("beneficiaryId") REFERENCES "beneficiary"("beneficiary_id") ON DELETE RESTRICT ON UPDATE CASCADE;
