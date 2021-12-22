const fs = require('fs')
require('dotenv').config()
const express = require('express')
const app = express()

app.use(express.json())
app.use(express.static(__dirname + '/public'))
app.use(express.urlencoded({ extended: true }))
app.set('view engine', 'ejs')
app.set('views', './views')
app.listen(process.env.PORT || 8080)

const discord = require('./discord.js')
discord.startDiscordBot()

// Use live data from Twitter
app.get('/', async function (req, res) {
	fs.readFile('./public/eth-profiles.json', (err, data) => {
		if (err) {
			console.log('File read failed:', err)
			res.send('Error')
			return
		}

		const profiles = JSON.parse(data)

		const followers = profiles.map((profile) => {
			if (profile.followers.toString().length === 6) {
				return profile.followers.toString().slice(0, -3) + 'k'
			} else if (profile.followers.toString().length === 5) {
				return profile.followers.toString().slice(0, -3) + 'k'
			}
			return profile.followers
		})

		const floor10 = followers[9]
		const floor100 = followers[99]
		const floor200 = followers[199]

		res.render('pages/index', {
			profiles: profiles,
			floor10: floor10,
			floor100: floor100,
			floor200: floor200,
		})
	})
})

const db = require('./database')
const twitter = require('./twitter')

setInterval(() => {
	twitter.searchTwitterUsers(1)
	twitter.updateTwitterLocation()
	db.readData()
}, 5 * 60 * 1000)

db.readData()
twitter.searchTwitterUsers(1)
