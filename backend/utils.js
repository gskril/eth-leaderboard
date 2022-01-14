const { PrismaClient }  = require("@prisma/client");
const prisma = new PrismaClient();

const Twit = require('twit')
const T = new Twit({
    consumer_key: process.env.consumer_key,
    consumer_secret: process.env.consumer_secret,
    access_token: process.env.access_token,
    access_token_secret: process.env.access_token_secret
})

async function addFren(fren) {
	return await prisma.fren.upsert({
		where : {
			id: fren.id,
		},
		update: {
			name: fren.name,
			ens: fren.ens,
			handle: fren.handle,
			followers: fren.followers,
			verified: fren.verified,
			twitterPicture: fren.twitterPicture,
		}, create: {
			id: fren.id,
			name: fren.name,
			ens: fren.ens,
			handle: fren.handle,
			followers: fren.followers,
			createdAt: new Date(),
			verified: fren.verified,
			twitterPicture: fren.twitterPicture,
		},
	})
		.then(async (fren) => {
			// check the 100 most followed accounts in the database
			const frens = await prisma.fren.findMany({
				orderBy: { followers: 'desc' },
				where: {
					ens: {
						contains: 'eth',
					},
				},
				take: 100,
			})
			// get rank within the top 100
			const rank = frens.findIndex(f => f.id === fren.id)
			return rank
		})
}

async function getTwitterProfileByHandle(handle) {
	return T.get('users/show', { screen_name: handle })
		.then(async (res) => {
			return res.data
		})
}

async function getTwitterProfilesById(ids) {
    return T.get('users/lookup', { user_id: ids })
        .then(async (res) => {
            const profiles = res.data

			if (profiles.length === 1) {
				return profiles[0]
			}

            for (let i = 0; i < profiles.length; i++) {
                const profile = profiles[i]
                const ens = utils.extractEns(profile.name.toLowerCase())
            }
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

const extractEns = (name) => {
    try {
        return name.match(/[\w]*[.]eth/)[0]
    } catch (error) {
        return null
    }
}

module.exports = { addFren, getTwitterProfileByHandle, getTwitterProfilesById, tweetNewProfile, extractEns }
