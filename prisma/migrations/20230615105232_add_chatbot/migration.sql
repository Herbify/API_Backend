-- CreateTable
CREATE TABLE `Chatbot` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `question` LONGTEXT NOT NULL,
    `answer` LONGTEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
