# ETH Leaderboard

The most followed accounts with .eth names on Twitter

Built with Express.js and EJS. Deployed on [Railway](https://railway.app/).

## Run locally
- Rename .env.example to .env and enter the configuration details
	- PostgreSQL URL
	- [Twitter API](https://developer.twitter.com/) credentials
	- [Discord bot](https://discord.com/developers/applications) client token
- Run `npm run create-db`
- Run `npm start`


## Todo
- [x] Search bar
- [x] Improved Twitter monitor
- [ ] Better way to deal with ENS avatars
- [x] Switch to real database (PostgreSQL)
- [x] Filtering (ENS avatar, Twitter verified)
- [ ] Daily/weekly snapshots of the leaderboard