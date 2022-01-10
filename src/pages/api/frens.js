import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async (req, res) => {
  if (req.method === "GET") {
    let { count, skip } = req.query;
    if (count > 500) count = 500;
    count |= 100;
    skip |= 0;
    const allFrens =
      await prisma.$queryRaw`SELECT *, RANK () OVER (ORDER BY followers DESC) AS ranking FROM "Fren" WHERE LOWER(name) like '%.eth%' ORDER BY followers DESC LIMIT ${count} OFFSET ${skip}`;

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
    res.statusCode = 200;
    res.json(frens);
  }
};
