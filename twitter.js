const axios = require('axios')
const Twit = require('twit')
const fs = require('fs')
const db = require('./database')
const sleep = (ms) => { return new Promise(resolve => setTimeout(resolve, ms)) }

const T = new Twit({
	consumer_key: process.env.consumer_key,
	consumer_secret: process.env.consumer_secret,
	access_token: process.env.access_token,
	access_token_secret: process.env.access_token_secret,
})

let ethProfiles = []
async function searchTwitterUsers(page) {
	// Twitter API: "Only the first 1,000 matching results are available."
	// Similar to results on this search page: https://twitter.com/search?q=.eth&f=user
	T.get('users/search', {
		q: '.eth',
		count: 20,
		include_entities: false,
		page: page,
	})
		.then(async(res) => {
			const data = res.data
			if (data.length >= 1 && page < 20) {
				data.forEach((profile) => {
					if (profile.name.includes('.eth')) {
						ethProfiles.push({
							id: profile.id_str,
							name: profile.name,
							handle: profile.screen_name,
							followers: profile.followers_count,
							created: profile.created_at,
							verified: profile.verified,
							pfp: profile.profile_image_url_https.split('_normal')[0] + '_100x100.jpg',
						})
					}
				})

				page = page + 1
				searchTwitterUsers(page)
			} else {
				// Sort list from greatest to least followers and limit to 200 profiles
				ethProfiles.sort((a, b) => (a.followers > b.followers ? -1 : 1))
				ethProfiles.splice(200)

				previous100 = await db.readData()
				previous100.splice(0, 100)

				// Update data in Google Sheet
				for (let i = 0; i < ethProfiles.length; i++) {
					let profile = ethProfiles[i]
					// Rate limit is 60 requests per minute
					await sleep(1050)
				
					await db.writeData([
						[
							profile.id,
							profile.name,
							profile.handle,
							profile.followers,
							profile.created,
							profile.verified,
							profile.pfp,
						]
					])
					.catch((err) => {
						console.log('Error updating data in Google Sheets.', err.response.statusText)
					})
				}

				// Order database by follower count
				await db.reorderData()

				if (previous100.length === 0) {
					console.log('No previous list found')
				} else {
					// Only check for new users if there is a previous list
					const top100 = await db.readData()
					top100.splice(0, 100)
					findNewUsers(previous100, top100)
				}

				ethProfiles = []
			}
		})
		.catch((err) => {
			console.log('Error fetching data from Twitter API.', err.response.statusText)
		})
}

function findNewUsers(previous100, top100) {
	const newUsers = []

	top100.forEach((profile) => {
		if (!previous100.find((p) => p.handle === profile.handle)) {
			newUsers.push(profile)
		}
	})

	const time = new Date().toLocaleString('en-US', {
		timeZone: 'America/New_York',
	})

	if (newUsers.length > 0) {
		console.log(`New users found at ${time}`)
		console.table(newUsers)

		newUsers.forEach((user) => {
			// Compose tweet about the new profile
			const tweet = `${user.name} just entered the top 100 most followed Twitter accounts with a @ensdomains name! \n\nWelcome @${user.handle} 🎉`
			console.log(tweet)
			/* T.post('statuses/update', { status: tweet })
				.then((res) => {
					const tweetLink = `https://twitter.com/${res.data.user.screen_name}/status/${res.data.id_str}`
					console.log('Posted tweet:', tweetLink)
				})
				.catch((err) =>
					console.log(
						'Error posting tweet.',
						err.allErrors[0].message
					)
				) */
		})
	} else {
		console.log(`No updates found at ${time}`)
	}
}

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
	
			await db.writeData([
				[
					profile.id_str,
					profile.name,
					profile.screen_name,
					profile.followers_count,
					profile.created_at,
					profile.verified,
					profile.profile_image_url_https,
				]
			])
		} catch (err) {}
	}
}

module.exports = { searchTwitterUsers, updateTwitterLocation, getTwitterProfile, tweetNewProfile, updateAllProfiles }
