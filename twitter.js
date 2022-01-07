const axios = require('axios')
const Twit = require('twit')
const fs = require('fs')
const db = require('./database')
const utils = require('./utils')
const sleep = (ms) => { return new Promise(resolve => setTimeout(resolve, ms)) }

const T = new Twit({
	consumer_key: process.env.consumer_key,
	consumer_secret: process.env.consumer_secret,
	access_token: process.env.access_token,
	access_token_secret: process.env.access_token_secret,
})

async function updateTwitterLocation() {
	// Get number of registered ENS names from OpenSea
	const ensNames = () => {
		return axios
			.request({
				method: 'GET',
				url: 'https://api.opensea.io/api/v1/collection/ens/stats',
				headers: { Accept: 'application/json' },
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
		location: numOfEnsNames === 0 ? `` : `${numOfEnsNames} names registered`,
	})
		// .then((res) => console.log('Updated location.'))
		.catch((err) => console.log('Error updating location.', err))
}

async function getTwitterProfile(handle) {
	return T.get('users/show', { screen_name: handle })
		.then((res) => {
			return res.data
		})
		.catch((err) => {
			return console.log(`Error fetching @${handle} from Twitter API.`, err.allErrors[0].message)
		})
}

async function tweetNewProfile(msg, name, handle, rank) {
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

async function updateAllProfiles() {
	const data = await db.readData()
	const handles = data.map((profile) => profile.handle)
	
	for (let i = 0; i < handles.length; i++) {
		const handle = handles[i]

		await sleep(500)
		try {
			const profile = await getTwitterProfile(handle)
			const ens = utils.extractEns(profile.name.toLowerCase())
	
			await db.writeData([
				[
					profile.id_str,
					profile.name,
					profile.screen_name,
					profile.followers_count,
					profile.created_at,
					profile.verified,
					profile.profile_image_url_https,
					await db.getAvatar(ens),
				]
			])
		} catch (err) {}
	}
}

module.exports = { updateTwitterLocation, getTwitterProfile, tweetNewProfile, updateAllProfiles }
