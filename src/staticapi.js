import { db } from "./db";

export const fetchInitialData = async (q, count = 100, skip = 0, verified) => {
  if (count > 500) count = 500;

  const criteria = {};
  if (q !== undefined)
    criteria.or = [{ "name ilike": `%${q}%`, "ens ilike": `%${q}%` }];

  const [allFrens, frensCount] = await db.withConnection(async (tx) => {
    const allFrensReq = await tx.fren_ranks.find(criteria, {
      offset: skip,
      limit: count,
    });
    const allFrensCount = await tx.fren_ranks.count(criteria);
    return [allFrensReq, allFrensCount];
  });

  const frens = allFrens.map((x) => ({
    id: x.id,
    name: x.name,
    ens: x.ens,
    handle: x.handle,
    followers: x.followers,
    verified: x.verified,
    tweeted: x.tweeted,
    created: x.created.toISOString(),
    ensAvatar: x.ens_avatar,
    twitterPicture: x.twitter_pfp,
    ranking: x.ranking,
  }));

  return { frens, count: frensCount };
};

export const fetchInitialMetadata = async () => {
  const [countAll, top1000] = await db.withConnection(async (tx) => {
    const countAllReq = await tx.fren_ranks.count();
    const top1000Req = await tx.fren_ranks.find({}, { offset: 0, limit: 1000 });
    return [countAllReq, top1000Req];
  });
  const top500 = top1000[999].followers;
  const top100 = top1000[99].followers;
  const top10 = top1000[9].followers;
  const response = {
    top10,
    top100,
    top500,
    countAll,
  };

  return response;
};
