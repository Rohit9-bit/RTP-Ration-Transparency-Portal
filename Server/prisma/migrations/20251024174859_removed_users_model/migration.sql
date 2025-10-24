/*
  Warnings:

  - You are about to drop the column `userId` on the `beneficiery` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `shop_owner` table. All the data in the column will be lost.
  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `address` to the `beneficiery` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `beneficiery` table without a default value. This is not possible if the table is not empty.
  - Added the required column `full_name` to the `beneficiery` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `beneficiery` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone_no` to the `beneficiery` table without a default value. This is not possible if the table is not empty.
  - Added the required column `owner_id` to the `shop_owner` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `shop_owner` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."beneficiery" DROP CONSTRAINT "beneficiery_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."shop_owner" DROP CONSTRAINT "shop_owner_userId_fkey";

-- DropIndex
DROP INDEX "public"."beneficiery_userId_key";

-- DropIndex
DROP INDEX "public"."shop_owner_userId_key";

-- AlterTable
ALTER TABLE "beneficiery" DROP COLUMN "userId",
ADD COLUMN     "address" TEXT NOT NULL,
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "full_name" TEXT NOT NULL,
ADD COLUMN     "password" TEXT NOT NULL,
ADD COLUMN     "phone_no" TEXT NOT NULL,
ALTER COLUMN "is_active" DROP NOT NULL,
ALTER COLUMN "is_active" SET DEFAULT true;

-- AlterTable
ALTER TABLE "shop_owner" DROP COLUMN "userId",
ADD COLUMN     "owner_id" TEXT NOT NULL,
ADD COLUMN     "password" TEXT NOT NULL;

-- DropTable
DROP TABLE "public"."users";
