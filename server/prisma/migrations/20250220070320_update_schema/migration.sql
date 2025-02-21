/*
  Warnings:

  - You are about to drop the `log` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `log` DROP FOREIGN KEY `Log_userId_fkey`;

-- AlterTable
ALTER TABLE `order` ADD COLUMN `amount` INTEGER NULL,
    ADD COLUMN `currentcy` VARCHAR(191) NULL,
    ADD COLUMN `status` VARCHAR(191) NULL,
    ADD COLUMN `strpePaymentId` VARCHAR(191) NULL;

-- DropTable
DROP TABLE `log`;
