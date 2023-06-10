/*
  Warnings:

  - You are about to drop the column `group` on the `MessageGroup` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `MessageGroup` DROP COLUMN `group`,
    ADD COLUMN `finish` BOOLEAN NOT NULL DEFAULT false;
