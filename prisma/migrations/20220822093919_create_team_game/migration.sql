/*
  Warnings:

  - The primary key for the `Team` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `logoUrl` on the `Team` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Team` table. All the data in the column will be lost.
  - You are about to drop the column `nickname` on the `Team` table. All the data in the column will be lost.
  - You are about to drop the column `year_founded` on the `Team` table. All the data in the column will be lost.
  - The `id` column on the `Team` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `Todo` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[nbaApiId]` on the table `Team` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `fullName` to the `Team` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nbaApiId` to the `Team` table without a default value. This is not possible if the table is not empty.
  - The required column `uuId` was added to the `Team` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `yearFounded` to the `Team` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Team" DROP CONSTRAINT "Team_pkey",
DROP COLUMN "logoUrl",
DROP COLUMN "name",
DROP COLUMN "nickname",
DROP COLUMN "year_founded",
ADD COLUMN     "fullName" TEXT NOT NULL,
ADD COLUMN     "nbaApiId" INTEGER NOT NULL,
ADD COLUMN     "uuId" TEXT NOT NULL,
ADD COLUMN     "yearFounded" TEXT NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD PRIMARY KEY ("id");

-- DropTable
DROP TABLE "Todo";

-- CreateTable
CREATE TABLE "TeamGame" (
    "id" SERIAL NOT NULL,
    "uuId" TEXT NOT NULL,
    "seasonId" TEXT NOT NULL,
    "nbaApiId" INTEGER NOT NULL,
    "gameDate" TEXT NOT NULL,
    "matchup" TEXT NOT NULL,
    "wl" TEXT NOT NULL,
    "minutes" INTEGER NOT NULL,
    "points" INTEGER NOT NULL,
    "ftPct" INTEGER NOT NULL,
    "oReb" INTEGER NOT NULL,
    "dRef" INTEGER NOT NULL,
    "reb" INTEGER NOT NULL,
    "ast" INTEGER NOT NULL,
    "stl" INTEGER NOT NULL,
    "blk" INTEGER NOT NULL,
    "tov" INTEGER NOT NULL,
    "pf" INTEGER NOT NULL,
    "plusMinus" INTEGER NOT NULL,
    "teamId" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TeamGame.nbaApiId_unique" ON "TeamGame"("nbaApiId");

-- CreateIndex
CREATE UNIQUE INDEX "Team.nbaApiId_unique" ON "Team"("nbaApiId");

-- AddForeignKey
ALTER TABLE "TeamGame" ADD FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;
