require('dotenv').config()
const Twit = require('twit')
const axios = require('axios')
const utils = require('./utils')

const T = new Twit({
  consumer_key: process.env.consumer_key,
  consumer_secret: process.env.consumer_secret,
  access_token: process.env.access_token,
  access_token_secret: process.env.access_token_secret
})

;(async () => {
  const stream = T.stream('statuses/filter', { track: '@ethleaderboard' })

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
      if (account.screen_name === 'ethleaderboard') continue

      // Add each mentioned user to the database
      const handle = account.screen_name
      const profile = await utils.getTwitterProfileByHandle(handle)
      const ens = utils.extractEns(profile.name.toLowerCase())

      try {
        await utils.addFren({
          id: profile.id_str,
          name: profile.name,
          ens: ens,
          handle: profile.screen_name,
          followers: profile.followers_count,
          createdAt: new Date(),
          verified: profile.verified,
          twitterPicture: profile.profile_image_url_https
        })
          .then(() => console.log(`Added @${handle} to the database`))
      } catch (err) {
        console.log('Error writing to database from Twitter monitor', err)
      }
    }
  })
})()

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

async function refreshDatabase() {
  const frens = await utils.getAllFrens()

  // Break apart frens into chunks of 100 for Twitter API
  const chunks = utils.chunkArray(frens, 100)

  for (let i = 0; i < chunks.length; i++) {
    // Convert array into comma separated list for Twitter API
    const commaSeparatedIds = chunks[i].map((fren) => fren.id).join(',')
    await updateAllUsers(commaSeparatedIds)
      .then(() => console.log(`Finished chunk ${i}`))
  }

  console.log(`Finished refreshing database at ${new Date()}`)

  async function updateAllUsers (commaSeparatedIds) {
    return T.get('users/lookup', { user_id: commaSeparatedIds })
        .then(async (res) => {
            const profiles = res.data
  
            for (let i = 0; i < profiles.length; i++) {
                const profile = profiles[i]
  
                const ens = utils.extractEns(profile.name.toLowerCase())
                await utils.updateFren({
                  id: profile.id_str,
                  name: profile.name,
                  ens: ens,
                  handle: profile.screen_name,
                  followers: profile.followers_count,
                  verified: profile.verified,
                  twitterPicture: profile.profile_image_url_https
                })
            }
        })
  }
}

// Refresh all Twitter accounts in the database every hour
setInterval(() => refreshDatabase(), 12 * 60 * 60 * 1000)

// Refresh Twitter location every 5 minutes
setInterval(() => updateTwitterLocation(), 5 * 60 * 1000)
