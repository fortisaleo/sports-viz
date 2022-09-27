import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient, Team, TeamGame } from "@prisma/client";

const prisma = new PrismaClient();

export function organizeGamesBySeason(teamGames: TeamGame[]) {
  const gamesBySeason = {};
  for (const teamGame of teamGames) {
    const season = teamGame.SEASON_ID.slice(1);
    if (!gamesBySeason[season]) {
      gamesBySeason[season] = [];
    }
    gamesBySeason[season].push(teamGame);
  }
  return gamesBySeason;
}

export function sumStatsBySeason(gamesOrganizedBySeason: {
  [key: string]: TeamGame[];
}) {
  const statsSumedBySeason = {};
  for (const season of Object.keys(gamesOrganizedBySeason)) {
    const teamGames = gamesOrganizedBySeason[season];
    const statTotals = {
      AST: 0,
      BLK: 0,
      DREB: 0,
      FG3A: 0,
      FG3M: 0,
      FGA: 0,
      FGM: 0,
      FTA: 0,
      FTM: 0,
      OREB: 0,
      PTS: 0,
      REB: 0,
      STL: 0,
      TOV: 0,
      W: 0,
      L: 0,
    };
    for (const teamGame of teamGames) {
      statTotals.AST += teamGame.AST;
      statTotals.BLK += teamGame.BLK;
      statTotals.DREB += teamGame.DREB;
      statTotals.FG3A += teamGame.FG3A;
      statTotals.FG3M += teamGame.FG3M;
      statTotals.FGA += teamGame.FGA;
      statTotals.FGM += teamGame.FGM;
      statTotals.FTA += teamGame.FTA;
      statTotals.FTM += teamGame.FTM;
      statTotals.OREB += teamGame.OREB;
      statTotals.PTS += teamGame.PTS;
      statTotals.REB += teamGame.REB;
      statTotals.STL += teamGame.STL;
      statTotals.TOV += teamGame.TOV;
      if (teamGame.WL === "W") {
        statTotals.W += 1;
      } else if (teamGame.WL === "L") {
        statTotals.L += 1;
      }
    }
    statsSumedBySeason[season] = statTotals;
  }
  return statsSumedBySeason;
}

async function organizeStatsByTeam(teams: Team[]) {
  const statsOrganizedByTeamAndSeason = {};
  for (const team of teams) {
    const teamGames = await prisma.teamGame.findMany({
      where: {
        teamId: team.id,
      },
      orderBy: { createdAt: "desc" },
    });
    const gamesOrganizedBySeason = organizeGamesBySeason(teamGames);
    const teamsStatsBySeason = sumStatsBySeason(gamesOrganizedBySeason);
    statsOrganizedByTeamAndSeason[team.fullName] = teamsStatsBySeason;
  }
  return statsOrganizedByTeamAndSeason;
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    // get all todos
    const teams = await prisma.team.findMany({
      orderBy: { createdAt: "desc" },
    });

    const statsOragnizedByTeams = await organizeStatsByTeam(teams);
    res.json(statsOragnizedByTeams);
  }
};
