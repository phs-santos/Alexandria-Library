/*
  Warnings:

  - A unique constraint covering the columns `[libraryCard]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `User` ADD COLUMN `lastLogin` DATETIME(3) NULL,
    ADD COLUMN `libraryCard` VARCHAR(191) NULL,
    ADD COLUMN `membershipDate` DATETIME(3) NULL,
    ADD COLUMN `phone` VARCHAR(191) NULL,
    ADD COLUMN `status` ENUM('Active', 'Suspended', 'Pending') NOT NULL DEFAULT 'Pending';

-- CreateIndex
CREATE UNIQUE INDEX `User_libraryCard_key` ON `User`(`libraryCard`);
