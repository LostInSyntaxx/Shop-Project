/*
  Warnings:

  - A unique constraint covering the columns `[discordId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `User` ADD COLUMN `avatar` VARCHAR(191) NULL,
    ADD COLUMN `discordId` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `User_discordId_key` ON `User`(`discordId`);
