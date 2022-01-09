const axios = require('axios')
const Twit = require('twit')
const db = require('./database')
const utils = require('./utils/helpers.js')

const T = new Twit({
    consumer_key: process.env.consumer_key,
    consumer_secret: process.env.consumer_secret,
    access_token: process.env.access_token,
    access_token_secret: process.env.access_token_secret
})

async function startTwitterMonitor () {
    const stream = T.stream('statuses/filter', { track: '@ethleaderboard,ethleaderboard' })

    stream.on('tweet', async function (tweet) {
        const tweeter = { screen_name: tweet.user.screen_name }
        const mentionedAccounts = tweet.entities.user_mentions

        // Add tweeter to array of tagged accounts
        mentionedAccounts.push(tweeter)

        // Ignore the tweet if doesn't mention anyone
        if (mentionedAccounts.length === 0) return

        for (let i = 0; i < mentionedAccounts.length; i++) {
            const account = mentionedAccounts[i]

            // Ignore tags of @ethleaderboard
            if (account.screen_name === 'ethleaderboard' || account.screen_name === 'gregskril' || account.screen_name === 'BrantlyMillegan') continue

            // Add each mentioned user to the database
            const handle = account.screen_name
            const profile = await getTwitterProfile(handle)

            try {
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
                    .then(() => console.log(`Added @${handle} to the database.`))
            } catch (err) {
                try {
                    if (profile.name.toLowerCase().includes('.eth')) {
                        console.log(`Error adding @${profile.name} to database from Twitter monitor.`, err.response.statusText)
                    }
                } catch (err) {
                    // console.log(`${profile.name} does not have .eth in their display name`)
                }
            }
        }
    })
}

async function updateTwitterLocation () {
    // Get number of registered ENS names from OpenSea
    const ensNames = () => {
        return axios
            .request({
                method: 'GET',
                url: 'https://api.opensea.io/api/v1/collection/ens/stats',
                headers: { Accept: 'application/json' }
            })
            .then((res) => {
                return new Intl.NumberFormat().format(res.data.stats.count)
            })
            .catch((err) => {
                console.log('Error fetching data from OpenSea API.', err.response.statusText)
                return 0
            })
    }

    // Update Twitter profile's location with number of registered names every minute
    const numOfEnsNames = await ensNames()
    T.post('account/update_profile', {
        location: numOfEnsNames === 0 ? '' : `${numOfEnsNames} names registered`
    })
    // .then((res) => console.log('Updated location.'))
        .catch((err) => console.log('Error updating location.', err))
}

async function getTwitterProfile (handle) {
    return T.get('users/show', { screen_name: handle })
        .then((res) => {
            return res.data
        })
        .catch((err) => {
            return console.log(`Error fetching @${handle} from Twitter API.`, err)
        })
}

async function tweetNewProfile (msg, name, handle, rank) {
    const tweet = `${name} entered the top 100 most followed Twitter accounts with a @ensdomains name at number ${rank}! \n\nWelcome @${handle} 🎉`

    T.post('statuses/update', { status: tweet })
        .then((res) => {
            const tweetLink = `https://twitter.com/${res.data.user.screen_name}/status/${res.data.id_str}`
            console.log('Posted tweet:', tweetLink)
            msg.lineReply(`Posted tweet: ${tweetLink}`)
        })
        .catch((err) =>
            console.log(
                'Error posting tweet.',
                err.allErrors[0].message
            )
        )
}

async function updateAllProfiles () {
    const data = await db.readData()
    const handles = data.map((profile) => profile.handle)

    for (let i = 0; i < handles.length; i++) {
        const handle = handles[i]

        try {
            const profile = await getTwitterProfile(handle)
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
        } catch (err) {}
    }
}

module.exports = { startTwitterMonitor, updateTwitterLocation, getTwitterProfile, tweetNewProfile, updateAllProfiles }
