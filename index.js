require('dotenv').config()
const express = require('express')
const axios = require('axios')
const path = require('path')
const app = express()

app.use(express.json())
app.use(express.static(__dirname + '/public'))
app.use(express.urlencoded({ extended: true }))
app.set('view engine', 'ejs')
app.set('views', './views')
app.listen(process.env.PORT || 8080)

// Use live data from Twitter
app.get('/', async function (req, res) {
	const fs = require('fs')
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

const { searchTwitterUsers } = require('./twitter')
setInterval(() => searchTwitterUsers(1), 2 * 60 * 1000)
searchTwitterUsers(1)

