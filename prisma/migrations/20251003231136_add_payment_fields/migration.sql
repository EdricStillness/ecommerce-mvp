-- AlterTable
ALTER TABLE `Order` ADD COLUMN `paidAt` DATETIME(3) NULL,
    ADD COLUMN `paymentProvider` VARCHAR(20) NULL,
    ADD COLUMN `paymentToken` VARCHAR(255) NULL,
    ADD COLUMN `transactionId` VARCHAR(100) NULL;
