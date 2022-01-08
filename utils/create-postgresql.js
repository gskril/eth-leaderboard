require('dotenv').config()
const { Client } = require('pg')
const client = new Client(process.env.DATABASE_URL)
client.connect()

;(async () => {
    try {
        await client.query(`CREATE TABLE IF NOT EXISTS frens (
            id bigint PRIMARY KEY,
            name text NOT NULL,
            ens text,
            handle text NOT NULL,
            followers int NOT NULL,
            created timestamp NOT NULL,
            verified boolean NOT NULL,
            twitter_pfp text,
            ens_avatar text,
            tweeted boolean
        )`)
            .then(() => console.log('Table created'))
    } catch (e) {
        console.error('Error creating table', e.stack)
    }
    process.exit()
})()
