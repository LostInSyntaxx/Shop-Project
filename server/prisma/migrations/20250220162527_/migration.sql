/*
  Warnings:

  - Made the column `amount` on table `order` required. This step will fail if there are existing NULL values in that column.
  - Made the column `currentcy` on table `order` required. This step will fail if there are existing NULL values in that column.
  - Made the column `status` on table `order` required. This step will fail if there are existing NULL values in that column.
  - Made the column `strpePaymentId` on table `order` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `order` MODIFY `amount` INTEGER NOT NULL,
    MODIFY `currentcy` VARCHAR(191) NOT NULL,
    MODIFY `status` VARCHAR(191) NOT NULL,
    MODIFY `strpePaymentId` VARCHAR(191) NOT NULL;
