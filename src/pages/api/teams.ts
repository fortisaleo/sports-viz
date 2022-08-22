import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    // get all todos
    const todos = await prisma.team.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json(todos);
  }
};
