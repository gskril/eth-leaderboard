import Pgp from "pg-promise";
import { db } from "../index.js";

const pgp = Pgp();

export async function addFren(fren) {
  return await db.Fren.insert(fren, {
    onConflict: {
      target: "id",
      action: "update",
      exclude: ["createdAt"],
    },
  })
    .then(() => db.fren_ranks.refresh(true))
    .then(() => db.fren_ranks.findOne({ id: fren.id }, { fields: ["ranking"] }))
    .then((rank) => (rank > 100 ? -1 : rank));
}

export async function updateFren(fren) {
  return await db.Fren.update(fren.id, fren).then(() =>
    db.fren_ranks.refresh(true)
  );
}

export async function updateFrens(frens) {
  const cs = new pgp.helpers.ColumnSet(
    ["id", "name", "ens", "handle", "followers", "verified", "twitter_pfp"],
    { table: "Fren" }
  );
  const update = pgp.helpers.update(frens, cs) + " WHERE v.id = t.id";
  await db.query(update);
  return db.fren_ranks.refresh(true);
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
