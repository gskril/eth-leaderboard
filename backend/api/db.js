import { prisma } from "../index.js";

export async function addFren(fren) {
  return await prisma.fren
    .upsert({
      where: {
        id: fren.id,
      },
      update: {
        name: fren.name,
        ens: fren.ens,
        handle: fren.handle,
        followers: fren.followers,
        verified: fren.verified,
        twitterPicture: fren.twitterPicture,
      },
      create: {
        id: fren.id,
        name: fren.name,
        ens: fren.ens,
        handle: fren.handle,
        followers: fren.followers,
        createdAt: new Date(),
        verified: fren.verified,
        twitterPicture: fren.twitterPicture,
      },
    })
    .then(async (fren) => {
      // check the 100 most followed accounts in the database
      const frens = await prisma.fren.findMany({
        orderBy: { followers: "desc" },
        where: {
          ens: {
            contains: "eth",
            mode: "insensitive",
          },
        },
        take: 100,
      });
      // get rank within the top 100
      const rank = frens.findIndex((f) => f.id === fren.id);
      return rank;
    });
}

export async function updateFren(fren) {
  return await prisma.fren.update({
    where: {
      id: fren.id,
    },
    data: {
      name: fren.name,
      ens: fren.ens,
      handle: fren.handle,
      followers: fren.followers,
      verified: fren.verified,
      twitterPicture: fren.twitterPicture,
    },
  });
}

export async function updateFrens(frens) {
  return await prisma.$transaction([
    ...frens.map((fren) =>
      prisma.fren.update({
        where: { id: fren.id },
        data: {
          name: fren.name,
          ens: fren.ens,
          handle: fren.handle,
          followers: fren.followers,
          verified: fren.verified,
          twitterPicture: fren.twitterPicture,
        },
      })
    ),
  ]);
}

export async function getAllFrens() {
  return await prisma.fren.findMany({
    orderBy: { followers: "desc" },
    where: {
      ens: {
        contains: ".eth",
        mode: "insensitive",
      },
    },
    select: {
      id: true,
    },
  });
}
