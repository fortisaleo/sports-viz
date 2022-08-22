/*
  Warnings:

  - Changed the type of `yearFounded` on the `Team` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Team" DROP COLUMN "yearFounded",
ADD COLUMN     "yearFounded" INTEGER NOT NULL;
