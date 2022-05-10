# ETH Leaderboard

The most followed accounts with .eth names on Twitter

## Run locally

Create a PostgreSQL container with the following table structure:
```sql
CREATE TABLE "Fren" (
    "id" text NOT NULL,
    "name" text NOT NULL,
    "ens" text,
    "handle" text NOT NULL,
    "followers" int4 NOT NULL,
    "created" timestamp NOT NULL,
    "verified" bool NOT NULL,
    "twitter_pfp" text,
    PRIMARY KEY ("id")
);
```

Create a materialized view called `fren_ranks` with the following structure:
```sql
SELECT "Fren".id,
    "Fren".name,
    "Fren".ens,
    "Fren".handle,
    "Fren".followers,
    "Fren".created,
    "Fren".verified,
    "Fren".twitter_pfp,
    rank() OVER (ORDER BY "Fren".followers DESC) AS ranking
FROM "Fren"
WHERE lower("Fren".name) ~~ '%.eth%'::text AND "Fren".ens IS NOT NULL;
```

Rename `.env.example` to `.env` and configure the variables:

```bash
PGDATABASE = ''
PGPORT = ''
PGPASSWORD = ''
PGHOST = ''
PGUSER = ''
```

Run the NextJS development server 

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000)
