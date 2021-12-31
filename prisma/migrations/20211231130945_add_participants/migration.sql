-- CreateTable
CREATE TABLE `PartipantsOnEvents` (
    `eventId` VARCHAR(191) NOT NULL,
    `participantId` VARCHAR(191) NOT NULL,
    `joinedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`eventId`, `participantId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
