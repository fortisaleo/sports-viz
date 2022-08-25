// https://www.sportslogos.net

import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient, Team } from "@prisma/client";
import axios from "axios";

const logos = {};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    res.json({});
  }
};
