import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import fetch from "node-fetch";
import cheerio from "cheerio";

const prisma = new PrismaClient();

async function getRawTeamsHTML() {
  const response = await fetch("https://www.basketball-reference.com/teams/");
  const data = await response.text();
  return data;
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    // get all todos
    const rawTeamsHTML = await getRawTeamsHTML();
    const parsedTeamsHTMl = cheerio.load(rawTeamsHTML);
    const activeFranchisesTable = parsedTeamsHTMl(
      "[data-stat=franch_name] > a"
    );
    const teamLinks = [];
    for (let i = 0; i < activeFranchisesTable.length; i++) {
      const teamLink = activeFranchisesTable[i].attribs.href;
      if (!teamLinks.includes(teamLink)) {
        teamLinks.push(teamLink);
      }
    }
    console.log("The team links", teamLinks);
    console.log(teamLinks.length);

    res.json({ status: "ok" });
  } else if (req.method === "POST") {
    // create todo
    const text = JSON.parse(req.body).text;
    const todo = await prisma.todo.create({
      data: { text, completed: false },
    });

    res.json(todo);
  } else if (req.method === "PUT") {
    // update todo
    const id = req.query.todoId as string;
    const data = JSON.parse(req.body);
    const todo = await prisma.todo.update({
      where: { id },
      data,
    });

    res.json(todo);
  } else if (req.method === "DELETE") {
    // delete todo
    const id = req.query.todoId as string;
    await prisma.todo.delete({ where: { id } });

    res.json({ status: "ok" });
  }
};
