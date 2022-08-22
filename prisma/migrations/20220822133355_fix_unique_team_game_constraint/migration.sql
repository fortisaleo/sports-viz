/*
  Warnings:

  - A unique constraint covering the columns `[teamId,nbaApiId]` on the table `TeamGame` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "TeamGame_nbaApiId_key";

-- CreateIndex
CREATE UNIQUE INDEX "TeamGame_teamId_nbaApiId_key" ON "TeamGame"("teamId", "nbaApiId");
