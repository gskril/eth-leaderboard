require('dotenv').config()
const Twit = require('twit')
const cron = require('node-cron')
const db = require('./../database')
const utils = require('./helpers.js')

const T = new Twit({
    consumer_key: process.env.consumer_key,
    consumer_secret: process.env.consumer_secret,
    access_token: process.env.access_token,
    access_token_secret: process.env.access_token_secret
})

cron.schedule('*/30 * * * *', async () => {
    await db.readData(100)
        .then(async (data) => {
            const ids = data.map((profile) => profile.id)

            // create an array of arrays of 100 ids
            const chunks = utils.chunkArray(ids, 100)
            for (let i = 0; i < chunks.length; i++) {
                // convert handles into comma separated list
                const commaSeparatedIds = chunks[i].join(',')
                await lookupUsers(commaSeparatedIds)
            }
        })
})

async function lookupUsers (commaSeparatedIds) {
    T.get('users/lookup', { user_id: commaSeparatedIds })
        .then(async (res) => {
            const profiles = res.data

            for (let i = 0; i < profiles.length; i++) {
                const profile = profiles[i]

                const ens = utils.extractEns(profile.name.toLowerCase())
                await db.writeData([
                    profile.id_str,
                    profile.name,
                    ens,
                    profile.screen_name,
                    profile.followers_count,
                    profile.created_at,
                    profile.verified,
                    profile.profile_image_url_https,
                    await db.getAvatar(ens)
                ])
            }
        })
}
