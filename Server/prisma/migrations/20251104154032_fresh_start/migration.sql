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
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "security_PIN" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "centerId" TEXT NOT NULL,

    CONSTRAINT "beneficiary_pkey" PRIMARY KEY ("beneficiary_id")
);

-- CreateTable
CREATE TABLE "shop_owner" (
    "manager_id" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone_no" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "owner_id" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "shop_owner_pkey" PRIMARY KEY ("manager_id")
);

-- CreateTable
CREATE TABLE "distribution_center" (
    "center_id" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "center_name" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "managerId" TEXT NOT NULL,

    CONSTRAINT "distribution_center_pkey" PRIMARY KEY ("center_id")
);

-- CreateTable
CREATE TABLE "commodity" (
    "commodity_id" TEXT NOT NULL,
    "commodity_name" TEXT NOT NULL,
    "unit" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "commodity_pkey" PRIMARY KEY ("commodity_id")
);

-- CreateTable
CREATE TABLE "quota" (
    "quota_id" TEXT NOT NULL,
    "month_year" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "quantity_entitled" DOUBLE PRECISION NOT NULL,
    "quantity_remaining" DOUBLE PRECISION NOT NULL,
    "beneficiaryId" TEXT NOT NULL,
    "commodityId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "quota_pkey" PRIMARY KEY ("quota_id")
);

-- CreateTable
CREATE TABLE "transaction_log" (
    "transaction_id" TEXT NOT NULL,
    "quantity_entitled" DOUBLE PRECISION NOT NULL,
    "quantity_received" DOUBLE PRECISION NOT NULL,
    "is_verified_by_beneficiery" BOOLEAN NOT NULL,
    "anomaly_type" TEXT,
    "beneficiaryId" TEXT NOT NULL,
    "centerId" TEXT NOT NULL,
    "commodityId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "transaction_log_pkey" PRIMARY KEY ("transaction_id")
);

-- CreateTable
CREATE TABLE "shop_stock_ledger" (
    "ledger_id" TEXT NOT NULL,
    "stock_in_quantity" DOUBLE PRECISION NOT NULL,
    "stock_out_quantity" DOUBLE PRECISION NOT NULL,
    "centerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "commodityId" TEXT NOT NULL,

    CONSTRAINT "shop_stock_ledger_pkey" PRIMARY KEY ("ledger_id")
);

-- CreateTable
CREATE TABLE "grievance" (
    "grievance_id" TEXT NOT NULL,
    "issue_type" TEXT NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Pending',
    "priority_level" TEXT NOT NULL DEFAULT 'Medium',
    "centerId" TEXT NOT NULL,
    "beneficiaryId" TEXT NOT NULL,
    "commodityId" TEXT NOT NULL,
    "expected_quantity" DOUBLE PRECISION NOT NULL,
    "actual_quantity" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "grievance_pkey" PRIMARY KEY ("grievance_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "beneficiary_beneficiary_id_key" ON "beneficiary"("beneficiary_id");

-- CreateIndex
CREATE UNIQUE INDEX "beneficiary_ration_card_no_key" ON "beneficiary"("ration_card_no");

-- CreateIndex
CREATE UNIQUE INDEX "shop_owner_manager_id_key" ON "shop_owner"("manager_id");

-- CreateIndex
CREATE UNIQUE INDEX "distribution_center_center_id_key" ON "distribution_center"("center_id");

-- CreateIndex
CREATE UNIQUE INDEX "distribution_center_managerId_key" ON "distribution_center"("managerId");

-- CreateIndex
CREATE UNIQUE INDEX "commodity_commodity_id_key" ON "commodity"("commodity_id");

-- CreateIndex
CREATE UNIQUE INDEX "quota_quota_id_key" ON "quota"("quota_id");

-- CreateIndex
CREATE UNIQUE INDEX "quota_beneficiaryId_commodityId_month_year_key" ON "quota"("beneficiaryId", "commodityId", "month_year");

-- CreateIndex
CREATE UNIQUE INDEX "transaction_log_transaction_id_key" ON "transaction_log"("transaction_id");

-- CreateIndex
CREATE UNIQUE INDEX "shop_stock_ledger_ledger_id_key" ON "shop_stock_ledger"("ledger_id");

-- CreateIndex
CREATE UNIQUE INDEX "grievance_grievance_id_key" ON "grievance"("grievance_id");

-- AddForeignKey
ALTER TABLE "beneficiary" ADD CONSTRAINT "beneficiary_centerId_fkey" FOREIGN KEY ("centerId") REFERENCES "distribution_center"("center_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "distribution_center" ADD CONSTRAINT "distribution_center_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES "shop_owner"("manager_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quota" ADD CONSTRAINT "quota_beneficiaryId_fkey" FOREIGN KEY ("beneficiaryId") REFERENCES "beneficiary"("beneficiary_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quota" ADD CONSTRAINT "quota_commodityId_fkey" FOREIGN KEY ("commodityId") REFERENCES "commodity"("commodity_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaction_log" ADD CONSTRAINT "transaction_log_beneficiaryId_fkey" FOREIGN KEY ("beneficiaryId") REFERENCES "beneficiary"("beneficiary_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaction_log" ADD CONSTRAINT "transaction_log_centerId_fkey" FOREIGN KEY ("centerId") REFERENCES "distribution_center"("center_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaction_log" ADD CONSTRAINT "transaction_log_commodityId_fkey" FOREIGN KEY ("commodityId") REFERENCES "commodity"("commodity_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shop_stock_ledger" ADD CONSTRAINT "shop_stock_ledger_centerId_fkey" FOREIGN KEY ("centerId") REFERENCES "distribution_center"("center_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shop_stock_ledger" ADD CONSTRAINT "shop_stock_ledger_commodityId_fkey" FOREIGN KEY ("commodityId") REFERENCES "commodity"("commodity_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grievance" ADD CONSTRAINT "grievance_centerId_fkey" FOREIGN KEY ("centerId") REFERENCES "distribution_center"("center_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grievance" ADD CONSTRAINT "grievance_beneficiaryId_fkey" FOREIGN KEY ("beneficiaryId") REFERENCES "beneficiary"("beneficiary_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grievance" ADD CONSTRAINT "grievance_commodityId_fkey" FOREIGN KEY ("commodityId") REFERENCES "commodity"("commodity_id") ON DELETE RESTRICT ON UPDATE CASCADE;
