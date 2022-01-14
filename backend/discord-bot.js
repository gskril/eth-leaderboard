require('dotenv').config();
const utils = require('./utils');
const { Client, MessageEmbed } = require('discord.js');

require('discord-reply');
const discord = new Client();

const leaderboardChannel = '921149271972118548';
const testChannel = '922312173655572550';

discord
	.login(process.env.DISCORD_CLIENT_TOKEN)
	.catch(console.error)

discord.on('ready', () => {
	console.log('Discord bot is online')
})

discord.on('message', async (msg) => {
	const message = msg.content.toLowerCase()

	// Ignore messages from bots, dms, and messages that don't start with a twitter url
	if (msg.author.bot || msg.channel.type === 'dm' || !message.startsWith('https://twitter.com/')) return

	if (msg.channel.id === leaderboardChannel || msg.channel.id === testChannel) {
		const handle = message.split('https://twitter.com/')[1].split(/[?/ ]/)[0]
		const profile = await utils.getTwitterProfileByHandle(handle)

		const ens = utils.extractEns(profile.name.toLowerCase())

		await utils.addFren({
			id: profile.id_str,
			name: profile.name,
			ens: ens,
			handle: profile.screen_name,
			followers: profile.followers_count,
			createdAt: profile.created_at,
			verified: profile.verified,
			twitterPicture: profile.profile_image_url_https,
		})
			.then(async (rank) => {
				rank = rank + 1
				const top100 = rank > 0 && rank <= 100

				// If they haven't been tweeted and they rank in the top 100, offer to tweet them
				if (top100) {
					const embed = new MessageEmbed()
						.setDescription(`@${profile.screen_name} is in the top 100! \n\nReact with ✅ to tweet this`)
						.addField('Name', profile.name, true)
						.addField('Handle', profile.screen_name, true)
						.addField('Rank', rank, true)
	
					msg.lineReply(embed)
						.then((msg) => msg.react('✅'))
				} else {
					msg.lineReply(`${profile.screen_name} has been added to the database, but is not eligible for a tweet`)
				}
			})
	}
})

discord.on('messageReactionAdd', (reaction, user) => {
	// Ignore reactions from bots, and emojis other than the green checkmark
	if (user.bot || !reaction.message.author.bot || reaction.emoji.name !== '✅') return

	if (reaction.message.channel.id === leaderboardChannel || reaction.message.channel.id === testChannel) {
		// Tweet the profile to ethleaderboard
		const name = reaction.message.embeds[0].fields[0].value
		const handle = reaction.message.embeds[0].fields[1].value
		const rank = reaction.message.embeds[0].fields[2].value
		utils.tweetNewProfile(reaction.message, name, handle, rank)
	}
})
