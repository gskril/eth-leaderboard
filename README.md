# ETH Leaderboard

The most followed accounts with .eth names on Twitter

## Run locally

- Provision a Postgres container on [Railway](https://railway.app/)
- Connect to railway project `railway link`
- Migrate the database `railway run yarn migrate:dev` ([**Follow this article for info on adding to an existing DB**](https://www.prisma.io/docs/guides/database/developing-with-prisma-migrate/baselining))
- Run the NextJS app `railway run yarn dev`

## Todo

- [x] Re-implement buttons/search/filters
- [x] Re-implement twitter monitor
- [x] Pagination
- [ ] Add to verification queue from website
- [ ] Daily/weekly snapshots of the leaderboard
