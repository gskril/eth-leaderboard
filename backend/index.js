import { Client } from "discord.js";
import massive from "massive";
import Twit from "twit";
import Twitter from "twitter-v2";
import { refreshDatabase, updateTwitterLocation } from "./api";
import { start as startDiscord } from "./bots/discord";
import { start as startTwitter } from "./bots/twitter";
(await import("dotenv")).config({ path: "../.env" });

export const db = await massive({
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  database: process.env.DATABASE_DB,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASS,
  poolSize: 10,
});
export const discord = new Client();
export const T2 = new Twitter({
  consumer_key: process.env.consumer_key,
  consumer_secret: process.env.consumer_secret,
  access_token_key: process.env.access_token,
  access_token_secret: process.env.access_token_secret,
});
export const T = new Twit({
  consumer_key: process.env.consumer_key,
  consumer_secret: process.env.consumer_secret,
  access_token: process.env.access_token,
  access_token_secret: process.env.access_token_secret,
});

startTwitter();
startDiscord();

// Refresh all Twitter accounts in the database every hour
setInterval(() => refreshDatabase(), 12 * 60 * 60 * 1000);

// Refresh Twitter location every 5 minutes
setInterval(() => updateTwitterLocation(), 5 * 60 * 1000);
