-- CreateTable
CREATE TABLE "Team" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "abbreviation" TEXT NOT NULL,
    "nickname" TEXT NOT NULL,
    "year_founded" TEXT NOT NULL,
    "city" TEXT NOT NULL,

    PRIMARY KEY ("id")
);
