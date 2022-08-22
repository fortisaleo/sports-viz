import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    const { teamId } = req.query;
    if (typeof teamId !== "string") {
      throw new Error("team id needs to be string");
    }
    const games = await prisma.teamGame.findMany({
      where: {
        teamId: parseInt(teamId),
      },
      orderBy: { GAME_DATE: "desc" },
    });

    res.json(games);
  }
};
