const { Client, MessageEmbed } = require('discord.js')
require('discord-reply')
const discord = new Client({ fetchAllMembers: true })

const db = require('./database')
const twitter = require('./twitter')
const utils = require('./utils')

function startDiscordBot () {
    discord
        .login(process.env.DISCORD_CLIENT_TOKEN)
        .catch((err) => console.log('Invalid client token', err))

    const leaderboardChannel = '921149271972118548'
    const testChannel = '922312173655572550'

    discord.on('ready', () => {
        console.log('Discord bot is online')
    })

    discord.on('message', async (msg) => {
        const message = msg.content.toLowerCase()

        // Ignore messages from bots, dms, and messages that don't start with a twitter url
        if (
            msg.author.bot ||
		msg.channel.type === 'dm' ||
		!message.startsWith('https://twitter.com/')
        ) { return }

        if (msg.channel.id === leaderboardChannel || msg.channel.id === testChannel) {
            const handle = message.split('https://twitter.com/')[1].split(/[?\/ ]/)[0]
            const profile = await twitter.getTwitterProfile(handle)

            try {
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
                        await db.getAvatar(ens)
                    ]
                ])

                await db.readData()
                    .then((data) => {
                        // Get index of the object with the id of profile.id_str
                        const index = data.findIndex((obj) => obj.id === profile.id_str)

                        // Check if the profile has already been tweeted
                        let tweeted = false
                        if (index < 100 && index !== -1) {
                            tweeted = data[index].tweeted || 'false'
                            if (tweeted.toString().toLowerCase() === 'true') {
                                tweeted = true
                            } else {
                                tweeted = false
                            }
                        }

                        // If they haven't been tweeted and they rank in the top 100, offer to tweet them
                        if (index < 100 && index !== -1 && tweeted === false) {
                            const embed = new MessageEmbed()
                                .setDescription(`@${profile.screen_name} is in the top 100! \n\nReact with ✅ to tweet this`)
                                .addField('Name', profile.name, true)
                                .addField('Handle', profile.screen_name, true)
                                .addField('Rank', index + 1, true)

                            msg.lineReply(embed)
                                .then((msg) => msg.react('✅'))
                        } else if (index < 100 && tweeted === true) {
                            msg.lineReply(`${profile.screen_name} has been updated in the database. They've already been tweeted`)
                        } else {
                            msg.lineReply(`${profile.screen_name} has been added to the database, but is not eligible for a tweet`)
                        }
                    })
            } catch (error) {
                msg.lineReply('This profile doesn\'t have .eth in their name')
            }
        }
    })

    discord.on('messageReactionAdd', (reaction, user) => {
    // Ignore reactions from bots, and emojis other than the green checkmark
        if (
            user.bot ||
			!reaction.message.author.bot ||
			reaction.emoji.name !== '✅'
        ) { return }

        if (reaction.message.channel.id === leaderboardChannel) {
            // Tweet the profile to ethleaderboard
            const name = reaction.message.embeds[0].fields[0].value
            const handle = reaction.message.embeds[0].fields[1].value
            const rank = reaction.message.embeds[0].fields[2].value
            twitter.tweetNewProfile(reaction.message, name, handle, rank)
        }
    })
}

module.exports = { startDiscordBot }
