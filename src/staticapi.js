import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const fetchInitialData = async (q, count = 100, skip = 0, verified) => {
  if (count > 500) count = 500;
  const allFrens =
    await prisma.$queryRaw`SELECT * FROM (SELECT *, RANK () OVER (ORDER BY followers DESC) AS ranking FROM "Fren" WHERE LOWER(name) like '%.eth%') m1 WHERE true ${
      verified !== undefined
        ? verified === "true"
          ? Prisma.sql`AND verified`
          : Prisma.sql`AND NOT verified`
        : Prisma.empty
    } ${
      q !== undefined
        ? Prisma.sql`AND name ~~* ${`%${q}%`} OR ens ~~* ${`%${q}%`}`
        : Prisma.empty
    } ORDER BY followers DESC LIMIT ${count} OFFSET ${skip}`;

  const frensCount =
    await prisma.$queryRaw`SELECT COUNT(*) FROM (SELECT *, RANK () OVER (ORDER BY followers DESC) AS ranking FROM "Fren" WHERE LOWER(name) like '%.eth%') m1 WHERE true ${
      verified !== undefined
        ? verified === "true"
          ? Prisma.sql`AND verified`
          : Prisma.sql`AND NOT verified`
        : Prisma.empty
    } ${
      q !== undefined
        ? Prisma.sql`AND name ~~* ${`%${q}%`} OR ens ~~* ${`%${q}%`}`
        : Prisma.empty
    }`;

  const frens = allFrens.map((x) => ({
    id: x.id,
    name: x.name,
    ens: x.ens,
    handle: x.handle,
    followers: x.followers,
    verified: x.verified,
    tweeted: x.tweeted,
    created: x.created,
    ensAvatar: x.ens_avatar,
    twitterPicture: x.twitter_pfp,
    ranking: x.ranking,
  }));
  return { frens, count: frensCount[0].count };
};

export const fetchInitialMetadata = async () => {
  const countAll = await prisma.fren.count({
    where: {
      name: {
        contains: ".eth",
        mode: "insensitive",
      },
    },
  });
  const top500Query = await prisma.fren.findMany({
    take: 501,
    orderBy: {
      followers: "desc",
    },
  });
  const top500 = top500Query[500].followers;
  const top100 = top500Query[100].followers;
  const top10 = top500Query[10].followers;
  const response = {
    top10,
    top100,
    top500,
    countAll,
  };

  return response;
};
