import massive, { Database } from 'massive';

let db: Database;

export default async function getDb() {
  if (db) {
    return db;
  }

  return massive({
    host: process.env.PGHOST,
    port: Number(process.env.PGPORT),
    database: process.env.PGDATABASE,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
  }).then((instance) => {
    db = instance;
    return Promise.resolve(db);
  });
}
