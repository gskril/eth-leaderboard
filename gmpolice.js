const { MessageEmbed } = require("discord.js")
const Twit = require('twit')

const T = new Twit({
	consumer_key: 			process.env.gm_consumer_key,
	consumer_secret: 		process.env.gm_consumer_secret,
	access_token: 			process.env.gm_access_token,
	access_token_secret: 	process.env.gm_access_token_secret,
})

const stream = T.stream('statuses/filter', { track: 'gm' })

function startTwitterMonitor(discord, gmpoliceChannel, leaderboardChannel) {
	stream.on('tweet', (tweet) => {
		// Skip if it's a RT, quote tweet, reply, mentions the stock $GM, the person already has an ENS name,
		// the tweet doesn't start with "gm", or the person has under a specified number of followers
		if (
			tweet.retweeted_status ||
			tweet.quoted_status ||
			tweet.in_reply_to_status_id ||
			tweet.text.toLowerCase().includes('$gm') ||
			tweet.text.toLowerCase().includes('gm ceo') ||
			tweet.text.toLowerCase().includes('gm\'s') ||
			tweet.text.toLowerCase().includes('gm plans') ||
			tweet.text.toLowerCase().includes('gm exec') ||
			tweet.user.name.toLowerCase().includes('.eth') ||
			tweet.user.followers_count < process.env.minimum_followers ||
			!tweet.text.toLowerCase().startsWith('gm')
		)
			return
		
		const tweetUrl = 'https://twitter.com/' + tweet.user.screen_name + '/status/' + tweet.id_str
	
		const embed = new MessageEmbed()
			.setAuthor(tweet.user.name, tweet.user.profile_image_url_https, `https://twitter.com/${tweet.user.screen_name}`)
			.setTitle('New gm tweet')
			.setURL(tweetUrl)
			.setDescription(tweet.text)
			.addField('**Followers**', new Intl.NumberFormat().format(tweet.user.followers_count))
			.addField('**Share**', 'React to this message with ✅ to tweet it')
	
		// Send discord message with new gm tweets and reaction to trigger sharing
		discord.channels.cache.get(gmpoliceChannel).send(embed)
			.then((msg) => msg.react('✅'))
			.catch((err) => console.log('Error sending message to discord', err))
	})
}

function gmpoliceTweet(msg, link) {
	const message = `🚨🚨🚨 using gm without a .eth name on twitter ${link}`

	T.post('statuses/update', { status: message })
		.then((res) => {
			msg.lineReply(`Posted tweet: https://twitter.com/${res.data.user.screen_name}/status/${res.data.id_str}`)
		})
		.catch((err) => {
			console.log(
				'Error posting tweet.',
				err.allErrors[0].message
			)
			msg.lineReply('Error posting tweet, <@368179707910291458> take a look.')
		})
}

module.exports = { gmpoliceTweet, startTwitterMonitor }
