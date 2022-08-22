/*
  Warnings:

  - A unique constraint covering the columns `[nbaApiId]` on the table `TeamGame` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "TeamGame" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE UNIQUE INDEX "TeamGame_nbaApiId_key" ON "TeamGame"("nbaApiId");
