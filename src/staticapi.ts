import getDb from './db';
import { DatabaseFren, Fren } from './types';

interface InitialDataProps {
  q?: string;
  count?: number;
  skip?: number;
  verified?: boolean;
  location?: string;
}

export const fetchInitialData = async ({
  q,
  count = 100,
  skip = 0,
  verified,
  location,
}: InitialDataProps) => {
  const db = await getDb();

  const criteria: any = {};
  if (q !== undefined) {
    criteria.or = [{ 'handle ilike': `%${q}%` }, { 'ens ilike': `%${q}%` }];
  }

  if (location === 'new-york-city') {
    criteria.or = [
      { 'location ilike': `%nyc%` },
      { 'location ilike': `%new york%` },
      { 'location ilike': `%brooklyn%` },
      { 'location ilike': `%manhattan%` },
    ];
  } else if (location === 'san-francisco') {
    criteria.or = [
      { 'location ilike': `%san francisco%` },
      { 'location ilike': `%bay area%` },
      { 'location like': `%SF%` },
    ];
  } else if (location === 'los-angeles') {
    criteria.or = [{ 'location ilike': `%los angeles%` }];
  } else if (location === 'chicago') {
    criteria.or = [{ 'location ilike': `%chicago%` }];
  } else if (location === 'paris') {
    criteria.or = [{ 'location ilike': `%paris%` }];
  } else if (location === 'california') {
    criteria.or = [
      { 'location ilike': `%california%` },
      { 'location like': `%, CA%` },
      { 'location ilike': `%san diego%` },
      { 'location ilike': `%san francisco%` },
      { 'location ilike': `%bay area%` },
      { 'location like': `%SF%` },
      { 'location ilike': `%los angeles%` },
    ];
  } else if (location === 'texas') {
    criteria.or = [
      { 'location ilike': `%texas%` },
      { 'location ilike': `%, TX%` },
      { 'location ilike': `%houston%` },
      { 'location ilike': `%dallas%` },
      { 'location ilike': `%austin%` },
    ];
  } else if (location === 'toronto') {
    criteria.or = [{ 'location ilike': `%toronto%` }];
  } else if (location === 'quebec') {
    criteria.or = [{ 'location ilike': `%quebec%` }];
  }

  if (verified !== undefined) criteria.verified = verified;

  const [allFrens, frensCount] = await db.withConnection(async (tx) => {
    const allFrensReq = await tx.eth.find(criteria, {
      order: [
        { field: 'followers', direction: 'desc', nulls: 'last' },
        { field: 'handle' },
      ],
      offset: skip,
      limit: count,
    });
    const allFrensCount = parseInt(await tx.eth.count(criteria));
    return [allFrensReq, allFrensCount];
  });

  const frens = allFrens.map((x: DatabaseFren, i: number) => ({
    id: x.id,
    name: x.name,
    ens: x.ens.split('.eth')[0] + '.eth',
    handle: x.handle,
    followers: x.followers,
    verified: x.verified,
    updated: x.updated ? x.updated.toISOString() : null,
    pfp: x.avatar,
    ranking: i + 1 + skip,
  }));

  return { frens, count: frensCount };
};

export const fetchInitialMetadata = async () => {
  const db = await getDb();
  const [countAll, top1000] = await db.withConnection(async (tx) => {
    const countAllReq = parseInt(await tx.eth.count());
    const top1000Req = await tx.eth.find(
      {},
      {
        order: [{ field: 'followers', direction: 'desc', nulls: 'last' }],
        offset: 0,
        limit: 1000,
      }
    );
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
