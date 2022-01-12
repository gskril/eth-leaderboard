require('dotenv').config()
const db = require('./../database')
const twitter = require('./../twitter')
const utils = require('./helpers')
const data = require('./../twitter-replies.json')

bulkAddFromTwitter(data)

async function bulkAddFromTwitter (data) {
    for (let i = 0; i < data.length; i++) {
        try {
            const profile = await twitter.getTwitterProfile(data[i])
            const ens = utils.extractEns(profile.name.toLowerCase())

            // Skip if the person doesn't have .eth in their handle
            if (ens === null) {
                console.log(`${profile.name} does not include .eth`)
                continue
            }

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
                .then(() => console.log(`Added ${profile.name}`))
        } catch (err) {}
    }
    console.log('Finished adding all users to database')
    process.exit()
}
