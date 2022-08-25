// https://www.sportslogos.net

import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient, Team } from "@prisma/client";
import axios from "axios";

const prisma = new PrismaClient();

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    const teams = await prisma.team.findMany({
      orderBy: { createdAt: "desc" },
    });
    for (const team of teams) {
      const logoUrl = `https://d3p8xddnt3klwd.cloudfront.net/nba/teams/${
        team.abbreviation
      }/logo.${
        team.abbreviation === "NYK" || team.abbreviation === "MIA"
          ? "gif"
          : "png"
      }`;
      await prisma.team.update({
        where: {
          id: team.id,
        },
        data: {
          logoUrl,
        },
      });
    }
    res.json({ done: true });
  }
};
