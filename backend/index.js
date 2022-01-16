import Prisma from "@prisma/client";
import { Client } from "discord.js";
import Twit from "twit";
import { refreshDatabase, updateTwitterLocation } from "./api";
import { start as startDiscord } from "./bots/discord";
import { start as startTwitter } from "./bots/twitter";
const { PrismaClient } = Prisma;

export const prisma = new PrismaClient();
export const discord = new Client();
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
