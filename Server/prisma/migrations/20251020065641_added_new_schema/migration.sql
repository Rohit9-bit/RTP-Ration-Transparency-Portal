/*
  Warnings:

  - A unique constraint covering the columns `[phone_no]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Made the column `first_name` on table `users` required. This step will fail if there are existing NULL values in that column.
  - Made the column `last_name` on table `users` required. This step will fail if there are existing NULL values in that column.
  - Made the column `phone_no` on table `users` required. This step will fail if there are existing NULL values in that column.
  - Made the column `email` on table `users` required. This step will fail if there are existing NULL values in that column.
  - Made the column `address` on table `users` required. This step will fail if there are existing NULL values in that column.
  - Made the column `password` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "users" ALTER COLUMN "first_name" SET NOT NULL,
ALTER COLUMN "last_name" SET NOT NULL,
ALTER COLUMN "phone_no" SET NOT NULL,
ALTER COLUMN "email" SET NOT NULL,
ALTER COLUMN "address" SET NOT NULL,
ALTER COLUMN "password" SET NOT NULL;

-- CreateTable
CREATE TABLE "beneficiery" (
    "beneficiery_id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "family_size" INTEGER NOT NULL,
    "state" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "ration_card_no" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL,
    "centerId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "beneficiery_pkey" PRIMARY KEY ("beneficiery_id")
);

-- CreateTable
CREATE TABLE "shop_owner" (
    "manager_id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "shop_owner_pkey" PRIMARY KEY ("manager_id")
);

-- CreateTable
CREATE TABLE "distribution_center" (
    "center_id" SERIAL NOT NULL,
    "address" TEXT NOT NULL,
    "center_name" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "managerId" INTEGER NOT NULL,

    CONSTRAINT "distribution_center_pkey" PRIMARY KEY ("center_id")
);

-- CreateTable
CREATE TABLE "commodity" (
    "commodity_id" SERIAL NOT NULL,
    "commodity_name" TEXT NOT NULL,
    "unit" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "quotaId" INTEGER NOT NULL,
    "ledgerId" INTEGER NOT NULL,

    CONSTRAINT "commodity_pkey" PRIMARY KEY ("commodity_id")
);

-- CreateTable
CREATE TABLE "quota" (
    "quota_id" SERIAL NOT NULL,
    "month_year" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "quantity_entitled" DOUBLE PRECISION NOT NULL,
    "quantity_remaining" DOUBLE PRECISION NOT NULL,
    "beneficieryId" INTEGER NOT NULL,

    CONSTRAINT "quota_pkey" PRIMARY KEY ("quota_id")
);

-- CreateTable
CREATE TABLE "transaction_log" (
    "transaction_id" SERIAL NOT NULL,
    "quantity_entitled" DOUBLE PRECISION NOT NULL,
    "quantity_received" DOUBLE PRECISION NOT NULL,
    "is_verified_by_beneficiery" BOOLEAN NOT NULL,
    "anomaly_type" TEXT[] DEFAULT ARRAY['T_hour', 'Q_var']::TEXT[],
    "beneficieryId" INTEGER NOT NULL,
    "centerId" INTEGER NOT NULL,
    "commodityId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "transaction_log_pkey" PRIMARY KEY ("transaction_id")
);

-- CreateTable
CREATE TABLE "shop_stock_ledger" (
    "ledger_id" SERIAL NOT NULL,
    "stock_in_quantity" DOUBLE PRECISION NOT NULL,
    "stock_out_quantity" DOUBLE PRECISION NOT NULL,
    "centerId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "shop_stock_ledger_pkey" PRIMARY KEY ("ledger_id")
);

-- CreateTable
CREATE TABLE "grieviance" (
    "grieviance_id" SERIAL NOT NULL,
    "issue_type" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" TEXT[] DEFAULT ARRAY['New', 'In Review', 'Closed']::TEXT[],
    "centerId" INTEGER NOT NULL,
    "beneficieryId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "grieviance_pkey" PRIMARY KEY ("grieviance_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "beneficiery_userId_key" ON "beneficiery"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "beneficiery_ration_card_no_key" ON "beneficiery"("ration_card_no");

-- CreateIndex
CREATE UNIQUE INDEX "shop_owner_userId_key" ON "shop_owner"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "distribution_center_managerId_key" ON "distribution_center"("managerId");

-- CreateIndex
CREATE UNIQUE INDEX "commodity_quotaId_key" ON "commodity"("quotaId");

-- CreateIndex
CREATE UNIQUE INDEX "quota_beneficieryId_key" ON "quota"("beneficieryId");

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_no_key" ON "users"("phone_no");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "beneficiery" ADD CONSTRAINT "beneficiery_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "beneficiery" ADD CONSTRAINT "beneficiery_centerId_fkey" FOREIGN KEY ("centerId") REFERENCES "distribution_center"("center_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shop_owner" ADD CONSTRAINT "shop_owner_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

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
