-- AddForeignKey
ALTER TABLE `Message` ADD CONSTRAINT `Message_messageGroupId_fkey` FOREIGN KEY (`messageGroupId`) REFERENCES `MessageGroup`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
