import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { organizeGamesBySeason, sumStatsBySeason } from "../../tikToks";
import { generateYearsBetween } from "../../../../utils";

const prisma = new PrismaClient();

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    const { startYear, endYear } = req.query;
    if (!startYear || !endYear) {
      throw new Error("Need to pass back a year");
    }

    if (typeof startYear !== "string") {
      throw new Error("Incorret string");
    }

    if (typeof endYear !== "string") {
      throw new Error("Incorret strin");
    }

    const teams = await prisma.team.findMany({
      orderBy: { createdAt: "desc" },
    });

    const statsOrganizedByTeamAndSeason = {};
    const yearRange = generateYearsBetween(startYear, endYear);

    for (const team of teams) {
      const teamGames = await prisma.teamGame.findMany({
        where: {
          OR: yearRange.map((year) => {
            return {
              SEASON_ID: {
                endsWith: year,
              },
            };
          }),
          AND: [
            {
              teamId: team.id,
            },
          ],
        },
      });
      const gamesOrganizedBySeason = organizeGamesBySeason(teamGames);
      const teamsStatsBySeason = sumStatsBySeason(gamesOrganizedBySeason);
      statsOrganizedByTeamAndSeason[team.fullName] = teamsStatsBySeason;
    }

    res.json(statsOrganizedByTeamAndSeason);
  }
};
