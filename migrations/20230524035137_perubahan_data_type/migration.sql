/*
  Warnings:

  - You are about to drop the column `like` on the `articles` table. All the data in the column will be lost.
  - You are about to alter the column `tag` on the `articles` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Json`.
  - You are about to drop the column `rating` on the `products` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `articles` DROP COLUMN `like`,
    MODIFY `tag` JSON NULL;

-- AlterTable
ALTER TABLE `products` DROP COLUMN `rating`;

-- AlterTable
ALTER TABLE `useractivities` MODIFY `status` INTEGER NOT NULL;
