/*
  Warnings:

  - You are about to drop the `PartipantsOnEvents` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `PartipantsOnEvents`;

-- CreateTable
CREATE TABLE `ParticipantsOnEvents` (
    `eventId` VARCHAR(191) NOT NULL,
    `participantId` VARCHAR(191) NOT NULL,
    `joinedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`eventId`, `participantId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
