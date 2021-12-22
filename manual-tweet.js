require('dotenv').config()
const Twit = require('twit')

const T = new Twit({
	consumer_key: process.env.consumer_key,
	consumer_secret: process.env.consumer_secret,
	access_token: process.env.access_token,
	access_token_secret: process.env.access_token_secret,
})

const user = {
	name: '',
	handle: '',
	rank: '',
}

const tweet = `${user.name} entered the top 100 most followed Twitter accounts with a @ensdomains name at number ${user.rank}! \n\nWelcome @${user.handle} 🎉`
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