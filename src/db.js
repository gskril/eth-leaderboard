import massive from 'massive';

let db;

export default async function getDb() {
  if (db) {
    return db;
  }

  return massive({
    host: process.env.PGHOST,
    port: process.env.PGPORT,
    database: process.env.PGDATABASE,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    poolSize: 10,
  }).then((instance) => {
    db = instance;
    return Promise.resolve(db);
  });
}
