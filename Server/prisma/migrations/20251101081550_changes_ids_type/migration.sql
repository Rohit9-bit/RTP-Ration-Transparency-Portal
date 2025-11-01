/*
  Warnings:

  - The primary key for the `beneficiery` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `commodity` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `distribution_center` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `grieviance` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `quota` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `shop_owner` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `shop_stock_ledger` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `transaction_log` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `security_PIN` to the `beneficiery` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."beneficiery" DROP CONSTRAINT "beneficiery_centerId_fkey";

-- DropForeignKey
ALTER TABLE "public"."commodity" DROP CONSTRAINT "commodity_ledgerId_fkey";

-- DropForeignKey
ALTER TABLE "public"."commodity" DROP CONSTRAINT "commodity_quotaId_fkey";

-- DropForeignKey
ALTER TABLE "public"."distribution_center" DROP CONSTRAINT "distribution_center_managerId_fkey";

-- DropForeignKey
ALTER TABLE "public"."grieviance" DROP CONSTRAINT "grieviance_beneficieryId_fkey";

-- DropForeignKey
ALTER TABLE "public"."grieviance" DROP CONSTRAINT "grieviance_centerId_fkey";

-- DropForeignKey
ALTER TABLE "public"."quota" DROP CONSTRAINT "quota_beneficieryId_fkey";

-- DropForeignKey
ALTER TABLE "public"."shop_stock_ledger" DROP CONSTRAINT "shop_stock_ledger_centerId_fkey";

-- DropForeignKey
ALTER TABLE "public"."transaction_log" DROP CONSTRAINT "transaction_log_beneficieryId_fkey";

-- DropForeignKey
ALTER TABLE "public"."transaction_log" DROP CONSTRAINT "transaction_log_centerId_fkey";

-- DropForeignKey
ALTER TABLE "public"."transaction_log" DROP CONSTRAINT "transaction_log_commodityId_fkey";

-- AlterTable
ALTER TABLE "beneficiery" DROP CONSTRAINT "beneficiery_pkey",
ADD COLUMN     "security_PIN" INTEGER NOT NULL,
ALTER COLUMN "beneficiery_id" DROP DEFAULT,
ALTER COLUMN "beneficiery_id" SET DATA TYPE TEXT,
ALTER COLUMN "centerId" SET DATA TYPE TEXT,
ADD CONSTRAINT "beneficiery_pkey" PRIMARY KEY ("beneficiery_id");
DROP SEQUENCE "beneficiery_beneficiery_id_seq";

-- AlterTable
ALTER TABLE "commodity" DROP CONSTRAINT "commodity_pkey",
ALTER COLUMN "commodity_id" DROP DEFAULT,
ALTER COLUMN "commodity_id" SET DATA TYPE TEXT,
ALTER COLUMN "quotaId" SET DATA TYPE TEXT,
ALTER COLUMN "ledgerId" SET DATA TYPE TEXT,
ADD CONSTRAINT "commodity_pkey" PRIMARY KEY ("commodity_id");
DROP SEQUENCE "commodity_commodity_id_seq";

-- AlterTable
ALTER TABLE "distribution_center" DROP CONSTRAINT "distribution_center_pkey",
ALTER COLUMN "center_id" DROP DEFAULT,
ALTER COLUMN "center_id" SET DATA TYPE TEXT,
ALTER COLUMN "managerId" SET DATA TYPE TEXT,
ADD CONSTRAINT "distribution_center_pkey" PRIMARY KEY ("center_id");
DROP SEQUENCE "distribution_center_center_id_seq";

-- AlterTable
ALTER TABLE "grieviance" DROP CONSTRAINT "grieviance_pkey",
ALTER COLUMN "grieviance_id" DROP DEFAULT,
ALTER COLUMN "grieviance_id" SET DATA TYPE TEXT,
ALTER COLUMN "centerId" SET DATA TYPE TEXT,
ALTER COLUMN "beneficieryId" SET DATA TYPE TEXT,
ADD CONSTRAINT "grieviance_pkey" PRIMARY KEY ("grieviance_id");
DROP SEQUENCE "grieviance_grieviance_id_seq";

-- AlterTable
ALTER TABLE "quota" DROP CONSTRAINT "quota_pkey",
ALTER COLUMN "quota_id" DROP DEFAULT,
ALTER COLUMN "quota_id" SET DATA TYPE TEXT,
ALTER COLUMN "beneficieryId" SET DATA TYPE TEXT,
ADD CONSTRAINT "quota_pkey" PRIMARY KEY ("quota_id");
DROP SEQUENCE "quota_quota_id_seq";

-- AlterTable
ALTER TABLE "shop_owner" DROP CONSTRAINT "shop_owner_pkey",
ALTER COLUMN "manager_id" DROP DEFAULT,
ALTER COLUMN "manager_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "shop_owner_pkey" PRIMARY KEY ("manager_id");
DROP SEQUENCE "shop_owner_manager_id_seq";

-- AlterTable
ALTER TABLE "shop_stock_ledger" DROP CONSTRAINT "shop_stock_ledger_pkey",
ALTER COLUMN "ledger_id" DROP DEFAULT,
ALTER COLUMN "ledger_id" SET DATA TYPE TEXT,
ALTER COLUMN "centerId" SET DATA TYPE TEXT,
ADD CONSTRAINT "shop_stock_ledger_pkey" PRIMARY KEY ("ledger_id");
DROP SEQUENCE "shop_stock_ledger_ledger_id_seq";

-- AlterTable
ALTER TABLE "transaction_log" DROP CONSTRAINT "transaction_log_pkey",
ALTER COLUMN "transaction_id" DROP DEFAULT,
ALTER COLUMN "transaction_id" SET DATA TYPE TEXT,
ALTER COLUMN "beneficieryId" SET DATA TYPE TEXT,
ALTER COLUMN "centerId" SET DATA TYPE TEXT,
ALTER COLUMN "commodityId" SET DATA TYPE TEXT,
ADD CONSTRAINT "transaction_log_pkey" PRIMARY KEY ("transaction_id");
DROP SEQUENCE "transaction_log_transaction_id_seq";

-- AddForeignKey
ALTER TABLE "beneficiery" ADD CONSTRAINT "beneficiery_centerId_fkey" FOREIGN KEY ("centerId") REFERENCES "distribution_center"("center_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "distribution_center" ADD CONSTRAINT "distribution_center_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES "shop_owner"("manager_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commodity" ADD CONSTRAINT "commodity_quotaId_fkey" FOREIGN KEY ("quotaId") REFERENCES "quota"("quota_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commodity" ADD CONSTRAINT "commodity_ledgerId_fkey" FOREIGN KEY ("ledgerId") REFERENCES "shop_stock_ledger"("ledger_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quota" ADD CONSTRAINT "quota_beneficieryId_fkey" FOREIGN KEY ("beneficieryId") REFERENCES "beneficiery"("beneficiery_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaction_log" ADD CONSTRAINT "transaction_log_beneficieryId_fkey" FOREIGN KEY ("beneficieryId") REFERENCES "beneficiery"("beneficiery_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaction_log" ADD CONSTRAINT "transaction_log_centerId_fkey" FOREIGN KEY ("centerId") REFERENCES "distribution_center"("center_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaction_log" ADD CONSTRAINT "transaction_log_commodityId_fkey" FOREIGN KEY ("commodityId") REFERENCES "commodity"("commodity_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shop_stock_ledger" ADD CONSTRAINT "shop_stock_ledger_centerId_fkey" FOREIGN KEY ("centerId") REFERENCES "distribution_center"("center_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grieviance" ADD CONSTRAINT "grieviance_centerId_fkey" FOREIGN KEY ("centerId") REFERENCES "distribution_center"("center_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grieviance" ADD CONSTRAINT "grieviance_beneficieryId_fkey" FOREIGN KEY ("beneficieryId") REFERENCES "beneficiery"("beneficiery_id") ON DELETE RESTRICT ON UPDATE CASCADE;
