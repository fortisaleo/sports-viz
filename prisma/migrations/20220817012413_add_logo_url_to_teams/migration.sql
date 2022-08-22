/*
  Warnings:

  - You are about to drop the column `city` on the `Team` table. All the data in the column will be lost.
  - Added the required column `addressCity` to the `Team` table without a default value. This is not possible if the table is not empty.
  - Added the required column `addressState` to the `Team` table without a default value. This is not possible if the table is not empty.
  - Added the required column `logoUrl` to the `Team` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Team" DROP COLUMN "city",
ADD COLUMN     "addressCity" TEXT NOT NULL,
ADD COLUMN     "addressState" TEXT NOT NULL,
ADD COLUMN     "logoUrl" TEXT NOT NULL;
