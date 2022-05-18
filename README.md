# ETH Leaderboard

The most followed accounts with .eth names on Twitter

## Run locally

Create a PostgreSQL database with the following table:
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

Create a materialized view based on the above table:
```sql
CREATE MATERIALIZED VIEW eth AS (
    SELECT 
        id,
        name,
        REGEXP_REPLACE(LOWER(name), '^((?![^\s(｜|]+(.eth)).)*', '') AS ens,
        handle,
        location,
        description,
        followers,
        verified,
        avatar,
        added,
        updated,
        rank() OVER (ORDER BY followers DESC) AS rank
    FROM "Profile"
    WHERE LOWER(name) like '%.eth%'
);

CREATE UNIQUE INDEX ON eth (id);
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
