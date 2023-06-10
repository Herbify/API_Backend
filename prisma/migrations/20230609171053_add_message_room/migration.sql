/*
  Warnings:

  - Added the required column `doctorId` to the `MessageGroup` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `MessageGroup` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `MessageGroup` ADD COLUMN `doctorId` INTEGER NOT NULL,
    ADD COLUMN `userId` INTEGER NOT NULL,
    MODIFY `group` INTEGER NULL;
