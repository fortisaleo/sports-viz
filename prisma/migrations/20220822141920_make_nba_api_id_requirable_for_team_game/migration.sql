/*
  Warnings:

  - Made the column `nbaApiId` on table `TeamGame` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "TeamGame" ALTER COLUMN "nbaApiId" SET NOT NULL;
