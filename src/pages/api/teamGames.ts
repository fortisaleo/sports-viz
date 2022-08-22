import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    // get all todos
    const teams = await prisma.teamGame.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json(teams);
  }
};
