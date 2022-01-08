const fs = require('fs')
require('dotenv').config()
const express = require('express')
const app = express()
const path = require('path')

app.use(express.json())
app.use(express.static(path.resolve(__dirname, '/public')))
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

        // Handle rounding numbers for floor stats
        const followers = profiles.map((profile) => {
            if (profile.followers.toString().length === 7) {
                const firstDigit = profile.followers.toString()[0]
                const secondDigit = profile.followers.toString()[1]

                if (secondDigit === '0') {
                    return firstDigit + 'm'
                } else {
                    return firstDigit + '.' + secondDigit + 'm'
                }
            } else if (profile.followers.toString().length === 6) {
                return profile.followers.toString().slice(0, -3) + 'k'
            } else if (profile.followers.toString().length === 5) {
                return profile.followers.toString().slice(0, -3) + 'k'
            } else if (profile.followers.toString().length === 4) {
                const firstDigit = profile.followers.toString()[0]
                const secondDigit = profile.followers.toString()[1]

                if (secondDigit === '0') {
                    return firstDigit + 'k'
                } else {
                    return firstDigit + '.' + secondDigit + 'k'
                }
            } else {
                return profile.followers
            }
        })

        const floor10 = followers[9]
        const floor100 = followers[99]
        const floor500 = followers[499]

        res.render('pages/index', {
            profiles: profiles,
            floor10: floor10,
            floor100: floor100,
            floor500: floor500
        })
    })
})

const db = require('./database')
const twitter = require('./twitter')

twitter.startTwitterMonitor()
twitter.updateAllProfiles()
setInterval(twitter.updateTwitterLocation, 2 * 60 * 1000)
setInterval(twitter.updateAllProfiles, 30 * 60 * 1000)
