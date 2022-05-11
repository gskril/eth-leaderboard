# ETH Leaderboard

The most followed accounts with .eth names on Twitter

## Run locally

Create a PostgreSQL container with the following table structure:
```sql
CREATE TABLE "Profile" (
    "id" text NOT NULL,
    "name" text,
    "handle" text,
    "location" text,
    "description" text,
    "followers" int4,
    "verified" bool,
    "avatar" text,
    "added" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" timestamp(3),
    PRIMARY KEY ("id")
);
```

Create a materialized view called `eth` with the following structure:
```sql
SELECT "Profile".id,
    "Profile".name,
    lower(regexp_replace("Profile".name, '^((?![^\s(｜|]+(.eth)).)*'::text, ''::text)) AS ens,
    "Profile".handle,
    "Profile".location,
    "Profile".description,
    "Profile".followers,
    "Profile".verified,
    "Profile".avatar,
    "Profile".added,
    "Profile".updated,
    rank() OVER (ORDER BY "Profile".followers DESC) AS rank
FROM "Profile"
WHERE "Profile".name ~~ '%.eth%'::text;
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
