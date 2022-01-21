import Pgp from "pg-promise";
import { db } from "../index.js";

const pgp = Pgp();

export async function addFren(fren) {
  return await db.Fren.insert(fren, {
    onConflict: {
      target: "id",
      action: "update",
      exclude: ["created"],
    },
  })
    .then(() => db.fren_ranks.refresh(true))
    .then(() => db.fren_ranks.findOne({ id: fren.id }, { fields: ["ranking"] }))
    .then((rank) => {
      try {
        return parseInt(rank.ranking) > 100 || rank == null ? -1 : parseInt(rank.ranking)
      } catch (error) {
        return -1;
      }
    });
}

export async function updateFren(fren) {
  return await db.Fren.update(fren.id, fren).then(() =>
    db.fren_ranks.refresh(true)
  );
}

export async function updateFrens(frens) {
  const toUpdate = frens.filter((fren) => !fren.suspended);
  const toDelete = frens.filter((fren) => fren.suspended);
  const cs = new pgp.helpers.ColumnSet(
    ["id", "name", "ens", "handle", "followers", "verified", "twitter_pfp"],
    { table: "Fren" }
  );
  const update = pgp.helpers.update(toUpdate, cs) + " WHERE v.id = t.id";
  await db.query(update);
  toDelete.length > 0 && (await deleteFrens(toDelete));
  return db.fren_ranks.refresh(true);
}

export async function deleteFrens(frens) {
  return await db.Fren.destroy({
    "id in": frens.map((fren) => fren.id),
  });
}

export async function getAllFrens() {
  return await db.Fren.find(
    {},
    {
      fields: ["id"],
      order: [{ field: "followers", direction: "desc", nulls: "last" }],
    }
  );
}
