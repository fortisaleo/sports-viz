import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient, Team } from "@prisma/client";
import axios from "axios";

const prisma = new PrismaClient();

const BASE_API_URL = "https://flask-production-b806.up.railway.app";

interface TeamData {
  abbreviation: string;
  city: string;
  full_name: string;
  id: number;
  nickname: string;
  state: string;
  year_founded: number;
}

const columns = [
  "SEASON_ID",
  "TEAM_ID",
  "TEAM_ABBREVIATION",
  "TEAM_NAME",
  "GAME_ID",
  "GAME_DATE",
  "MATCHUP",
  "WL",
  "MIN",
  "PTS",
  "FGM",
  "FGA",
  "FG_PCT",
  "FG3M",
  "FG3A",
  "FG3_PCT",
  "FTM",
  "FTA",
  "FT_PCT",
  "OREB",
  "DREB",
  "REB",
  "AST",
  "STL",
  "BLK",
  "TOV",
  "PF",
  "PLUS_MINUS",
];

async function loadTeam(teamData: TeamData) {
  let finalTeam = null;
  const previouslyLoadedTeam = await prisma.team.findUnique({
    where: {
      nbaApiId: teamData.id,
    },
  });

  if (previouslyLoadedTeam) {
    finalTeam = previouslyLoadedTeam;
  } else {
    const team = await prisma.team.create({
      data: {
        abbreviation: teamData.abbreviation,
        addressCity: teamData.city,
        addressState: teamData.state,
        fullName: teamData.full_name,
        nbaApiId: teamData.id,
        nickName: teamData.nickname,
        yearFounded: teamData.year_founded,
      },
    });
    finalTeam = team;
  }

  console.log("Created team", finalTeam.fullName);
  return finalTeam;
}

interface GameData {
  AST: number;
  BLK: number;
  DREB: number;
  FG3A: number;
  FG3M: number;
  FG3_PCT: number;
  FGA: number;
  FGM: number;
  FG_PCT: number;
  FTA: number;
  FTM: number;
  FT_PCT: number;
  GAME_DATE: string;
  GAME_ID: string;
  MATCHUP: string;
  MIN: number;
  OREB: number;
  PF: number;
  PLUS_MINUS: number;
  PTS: number;
  REB: number;
  SEASON_ID: string;
  STL: number;
  TEAM_ABBREVIATION: string;
  TEAM_ID: number;
  TEAM_NAME: string;
  TOV: number;
  WL: string;
}

async function loadGame(gameData: GameData, team: Team) {
  let finalGame = null;
  const previouslyLoadedGame = await prisma.teamGame.findUnique({
    where: {
      nbaApiId: gameData.GAME_ID,
    },
  });

  if (previouslyLoadedGame) {
    finalGame = previouslyLoadedGame;
  } else {
    try {
      const game = await prisma.teamGame.create({
        data: {
          ...gameData,
          team: { connect: { id: team.id } },
          nbaApiId: gameData.GAME_ID,
        },
      });
      finalGame = game;
    } catch (e) {
      console.log("Error game", gameData);
      console.log(e);
      return;
    }
  }
  console.log("Created game", finalGame.MATCHUP, finalGame.GAME_DATE);
  return finalGame;
}

async function loadGames(gamesData: GameData[], team: Team) {
  for (const gameData of gamesData) {
    await loadGame(gameData, team);
  }
}

async function loadTeamsAndTeamGames(teamsData: TeamData[]) {
  for (const teamData of teamsData) {
    const team = await loadTeam(teamData);
    const response = await axios.get(
      `${BASE_API_URL}/games?team_id=${team.nbaApiId}`
    );
    const games = JSON.parse(response.data);
    await loadGames(games, team);
  }
  return;
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    // get all todos
    const response = await axios.get(`${BASE_API_URL}/teams`);

    const teams = response.data;

    await loadTeamsAndTeamGames(teams);

    res.json(teams.data);
  }
  //   } else if (req.method === "POST") {
  //     // create todo
  //     const text = JSON.parse(req.body).text;
  //     const todo = await prisma.todo.create({
  //       data: { text, completed: false },
  //     });

  //     res.json(todo);
  //   } else if (req.method === "PUT") {
  //     // update todo
  //     const id = req.query.todoId as string;
  //     const data = JSON.parse(req.body);
  //     const todo = await prisma.todo.update({
  //       where: { id },
  //       data,
  //     });

  //     res.json(todo);
  //   } else if (req.method === "DELETE") {
  //     // delete todo
  //     const id = req.query.todoId as string;
  //     await prisma.todo.delete({ where: { id } });

  //     res.json({ status: "ok" });
  //   }
};
