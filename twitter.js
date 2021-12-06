const axios = require('axios')
const Twit = require('twit')
const fs = require('fs')

const T = new Twit({
	consumer_key: process.env.consumer_key,
	consumer_secret: process.env.consumer_secret,
	access_token: process.env.access_token,
	access_token_secret: process.env.access_token_secret,
})

let ethProfiles = []
function searchTwitterUsers(page) {
	let previous100 = []
	try {
		// Set previous100 array to the contents of the saved json file
		previous100 = JSON.parse(
			fs.readFileSync('./public/eth-profiles.json', 'utf8')
		).splice(0, 100)
	} catch (e) {}

	// Twitter API: "Only the first 1,000 matching results are available."
	// Similar to results on this search page: https://twitter.com/search?q=.eth&f=user
	T.get('users/search', {
		q: '.eth',
		count: 20,
		include_entities: false,
		page: page,
	})
		.then((res) => {
			const data = res.data
			if (data.length >= 1 && page < 20) {
				data.forEach((profile) => {
					if (profile.name.includes('.eth')) {
						ethProfiles.push({
							name: profile.name,
							handle: profile.screen_name,
							followers: profile.followers_count,
							created: profile.created_at,
							verified: profile.verified,
						})
					}
				})

				page = page + 1
				searchTwitterUsers(page)
			} else {
				// Sort list from greatest to least followers and limit to 200 profiles
				ethProfiles.sort((a, b) => (a.followers > b.followers ? -1 : 1))
				ethProfiles.splice(200)
				outputTwitterUsers(ethProfiles)

				if (previous100.length === 0) {
					console.log('No previous list found')
				} else {
					// Only check for new users if there is a previous list
					const top100 = ethProfiles.splice(0, 100)
					findNewUsers(previous100, top100)
				}

				ethProfiles = []
			}
		})
		.catch((err) => {
			console.log('Error fetching data from Twitter API.', err)
		})
}

async function outputTwitterUsers(ethProfiles) {
	fs.writeFile(
		'./public/eth-profiles.json',
		JSON.stringify(ethProfiles),
		'utf8',
		function (err) {
			if (err) {
				return console.log(err)
			}
		}
	)
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
			T.post('statuses/update', { status: tweet })
				.then((res) => {
					const tweetLink = `https://twitter.com/${res.data.user.screen_name}/status/${res.data.id_str}`
					console.log('Posted tweet:', tweetLink)
				})
				.catch((err) =>
					console.log(
						'Error posting tweet.',
						err.allErrors[0].message
					)
				)
		})
	} else {
		console.log(`Fetched new data at ${time}`)
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
				console.log('Error fetching data from OpenSea API.', err)
				return 'Unknown'
			})
	}

	// Update Twitter profile's location with number of registered names every minute
	T.post('account/update_profile', {
		location: `${await ensNames()} names registered`,
	})
		// .then((res) => console.log('Updated location.'))
		.catch((err) => console.log('Error updating location.', err))
}

module.exports = { searchTwitterUsers, updateTwitterLocation }
