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

// Use live data from Twitter
app.get('/', async function (req, res) {
	fs.readFile('./public/eth-profiles.json', (err, data) => {
		if (err) {
			console.log('File read failed:', err)
			res.send('Error')
			return
		}
		res.render('pages/index', {
			profiles: JSON.parse(data),
		})
	})
})

const db = require('./database')
const twitter = require('./twitter')

setInterval(async() => {
	twitter.searchTwitterUsers(1)
	twitter.updateTwitterLocation()
	await db.readData()
}, 5 * 60 * 1000)

;(async () => {
	await db.readData()
	twitter.searchTwitterUsers(1)
})()
