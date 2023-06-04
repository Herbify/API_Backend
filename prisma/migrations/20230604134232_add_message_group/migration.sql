/*
  Warnings:

  - You are about to drop the `Messages` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `Messages`;

-- CreateTable
CREATE TABLE `MessageGroup` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `group` INTEGER NOT NULL,
    `status` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Message` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `messageGroupId` INTEGER NOT NULL,
    `sender` INTEGER NOT NULL,
    `recipient` INTEGER NOT NULL,
    `fromUser` BOOLEAN NOT NULL DEFAULT true,
    `content` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
