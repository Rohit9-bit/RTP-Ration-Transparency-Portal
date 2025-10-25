/*
  Warnings:

  - Added the required column `address` to the `shop_owner` table without a default value. This is not possible if the table is not empty.
  - Added the required column `district` to the `shop_owner` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `shop_owner` table without a default value. This is not possible if the table is not empty.
  - Added the required column `full_name` to the `shop_owner` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone_no` to the `shop_owner` table without a default value. This is not possible if the table is not empty.
  - Added the required column `state` to the `shop_owner` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "shop_owner" ADD COLUMN     "address" TEXT NOT NULL,
ADD COLUMN     "district" TEXT NOT NULL,
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "full_name" TEXT NOT NULL,
ADD COLUMN     "phone_no" TEXT NOT NULL,
ADD COLUMN     "state" TEXT NOT NULL;
