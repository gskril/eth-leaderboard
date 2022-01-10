import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async (req, res) => {
  if (req.method === "GET") {
    const countAll = await prisma.fren.count({
      where: {
        name: {
          contains: ".eth",
        },
      },
    });
    const top500Query = await prisma.fren.findMany({
      take: 500,
      orderBy: {
        followers: "desc",
      },
    });
    const top500 = top500Query[499].followers;
    const top100 = top500Query[99].followers;
    const top10 = top500Query[9].followers;
    const response = {
      top10,
      top100,
      top500,
      countAll,
    };

    console.log("responding", response);
    res.statusCode = 200;
    res.json(response);
  }
};
