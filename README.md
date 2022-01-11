# ETH Leaderboard

The most followed accounts with .eth names on Twitter

Built with Express.js and EJS. Deployed on [Railway](https://railway.app/).

# MIGRATION

## Run locally

- Provision a Postgres container on Railway
- Connect to railway project `railway link`
- Migrate the database `railway run yarn migrate:dev` ([**Follow this article for info on adding to an existing DB**](https://www.prisma.io/docs/guides/database/developing-with-prisma-migrate/baselining))
- Run the NextJS app `railway run yarn dev`

## Todo

- [x] Re-implement buttons/search/filters
- [ ] Re-implement twitter monitor
- [ ] Add to verification queue from website
- [x] Pagination
- [ ] Daily/weekly snapshots of the leaderboard
