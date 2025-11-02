-- AlterTable
ALTER TABLE "transaction_log" ALTER COLUMN "anomaly_type" DROP NOT NULL,
ALTER COLUMN "anomaly_type" DROP DEFAULT,
ALTER COLUMN "anomaly_type" SET DATA TYPE TEXT;
