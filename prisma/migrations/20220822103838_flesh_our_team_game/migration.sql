/*
  Warnings:

  - You are about to drop the column `ast` on the `TeamGame` table. All the data in the column will be lost.
  - You are about to drop the column `blk` on the `TeamGame` table. All the data in the column will be lost.
  - You are about to drop the column `dRef` on the `TeamGame` table. All the data in the column will be lost.
  - You are about to drop the column `ftPct` on the `TeamGame` table. All the data in the column will be lost.
  - You are about to drop the column `gameDate` on the `TeamGame` table. All the data in the column will be lost.
  - You are about to drop the column `matchup` on the `TeamGame` table. All the data in the column will be lost.
  - You are about to drop the column `minutes` on the `TeamGame` table. All the data in the column will be lost.
  - You are about to drop the column `oReb` on the `TeamGame` table. All the data in the column will be lost.
  - You are about to drop the column `pf` on the `TeamGame` table. All the data in the column will be lost.
  - You are about to drop the column `plusMinus` on the `TeamGame` table. All the data in the column will be lost.
  - You are about to drop the column `points` on the `TeamGame` table. All the data in the column will be lost.
  - You are about to drop the column `reb` on the `TeamGame` table. All the data in the column will be lost.
  - You are about to drop the column `seasonId` on the `TeamGame` table. All the data in the column will be lost.
  - You are about to drop the column `stl` on the `TeamGame` table. All the data in the column will be lost.
  - You are about to drop the column `tov` on the `TeamGame` table. All the data in the column will be lost.
  - You are about to drop the column `wl` on the `TeamGame` table. All the data in the column will be lost.
  - Added the required column `AST` to the `TeamGame` table without a default value. This is not possible if the table is not empty.
  - Added the required column `BLK` to the `TeamGame` table without a default value. This is not possible if the table is not empty.
  - Added the required column `DREB` to the `TeamGame` table without a default value. This is not possible if the table is not empty.
  - Added the required column `FG3A` to the `TeamGame` table without a default value. This is not possible if the table is not empty.
  - Added the required column `FG3M` to the `TeamGame` table without a default value. This is not possible if the table is not empty.
  - Added the required column `FG3_PCT` to the `TeamGame` table without a default value. This is not possible if the table is not empty.
  - Added the required column `FGA` to the `TeamGame` table without a default value. This is not possible if the table is not empty.
  - Added the required column `FGM` to the `TeamGame` table without a default value. This is not possible if the table is not empty.
  - Added the required column `FG_PCT` to the `TeamGame` table without a default value. This is not possible if the table is not empty.
  - Added the required column `FTA` to the `TeamGame` table without a default value. This is not possible if the table is not empty.
  - Added the required column `FTM` to the `TeamGame` table without a default value. This is not possible if the table is not empty.
  - Added the required column `FT_PCT` to the `TeamGame` table without a default value. This is not possible if the table is not empty.
  - Added the required column `GAME_DATE` to the `TeamGame` table without a default value. This is not possible if the table is not empty.
  - Added the required column `GAME_ID` to the `TeamGame` table without a default value. This is not possible if the table is not empty.
  - Added the required column `MATCHUP` to the `TeamGame` table without a default value. This is not possible if the table is not empty.
  - Added the required column `MIN` to the `TeamGame` table without a default value. This is not possible if the table is not empty.
  - Added the required column `OREB` to the `TeamGame` table without a default value. This is not possible if the table is not empty.
  - Added the required column `PF` to the `TeamGame` table without a default value. This is not possible if the table is not empty.
  - Added the required column `PLUS_MINUS` to the `TeamGame` table without a default value. This is not possible if the table is not empty.
  - Added the required column `PTS` to the `TeamGame` table without a default value. This is not possible if the table is not empty.
  - Added the required column `REB` to the `TeamGame` table without a default value. This is not possible if the table is not empty.
  - Added the required column `SEASON_ID` to the `TeamGame` table without a default value. This is not possible if the table is not empty.
  - Added the required column `STL` to the `TeamGame` table without a default value. This is not possible if the table is not empty.
  - Added the required column `TEAM_ABBREVIATION` to the `TeamGame` table without a default value. This is not possible if the table is not empty.
  - Added the required column `TEAM_ID` to the `TeamGame` table without a default value. This is not possible if the table is not empty.
  - Added the required column `TEAM_NAME` to the `TeamGame` table without a default value. This is not possible if the table is not empty.
  - Added the required column `TOV` to the `TeamGame` table without a default value. This is not possible if the table is not empty.
  - Added the required column `WL` to the `TeamGame` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "TeamGame" DROP CONSTRAINT "TeamGame_teamId_fkey";

-- AlterTable
ALTER TABLE "TeamGame" DROP COLUMN "ast",
DROP COLUMN "blk",
DROP COLUMN "dRef",
DROP COLUMN "ftPct",
DROP COLUMN "gameDate",
DROP COLUMN "matchup",
DROP COLUMN "minutes",
DROP COLUMN "oReb",
DROP COLUMN "pf",
DROP COLUMN "plusMinus",
DROP COLUMN "points",
DROP COLUMN "reb",
DROP COLUMN "seasonId",
DROP COLUMN "stl",
DROP COLUMN "tov",
DROP COLUMN "wl",
ADD COLUMN     "AST" INTEGER NOT NULL,
ADD COLUMN     "BLK" INTEGER NOT NULL,
ADD COLUMN     "DREB" INTEGER NOT NULL,
ADD COLUMN     "FG3A" INTEGER NOT NULL,
ADD COLUMN     "FG3M" INTEGER NOT NULL,
ADD COLUMN     "FG3_PCT" INTEGER NOT NULL,
ADD COLUMN     "FGA" INTEGER NOT NULL,
ADD COLUMN     "FGM" INTEGER NOT NULL,
ADD COLUMN     "FG_PCT" INTEGER NOT NULL,
ADD COLUMN     "FTA" INTEGER NOT NULL,
ADD COLUMN     "FTM" INTEGER NOT NULL,
ADD COLUMN     "FT_PCT" INTEGER NOT NULL,
ADD COLUMN     "GAME_DATE" TEXT NOT NULL,
ADD COLUMN     "GAME_ID" TEXT NOT NULL,
ADD COLUMN     "MATCHUP" TEXT NOT NULL,
ADD COLUMN     "MIN" INTEGER NOT NULL,
ADD COLUMN     "OREB" INTEGER NOT NULL,
ADD COLUMN     "PF" INTEGER NOT NULL,
ADD COLUMN     "PLUS_MINUS" INTEGER NOT NULL,
ADD COLUMN     "PTS" INTEGER NOT NULL,
ADD COLUMN     "REB" INTEGER NOT NULL,
ADD COLUMN     "SEASON_ID" TEXT NOT NULL,
ADD COLUMN     "STL" INTEGER NOT NULL,
ADD COLUMN     "TEAM_ABBREVIATION" TEXT NOT NULL,
ADD COLUMN     "TEAM_ID" INTEGER NOT NULL,
ADD COLUMN     "TEAM_NAME" TEXT NOT NULL,
ADD COLUMN     "TOV" INTEGER NOT NULL,
ADD COLUMN     "WL" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "TeamGame" ADD CONSTRAINT "TeamGame_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- RenameIndex
ALTER INDEX "Team.nbaApiId_unique" RENAME TO "Team_nbaApiId_key";

-- RenameIndex
ALTER INDEX "TeamGame.nbaApiId_unique" RENAME TO "TeamGame_nbaApiId_key";
