require('dotenv').config()
const axios = require('axios')
const db = require('../database.js')

let opensheetUrl
if (process.env.GOOGLE_SHEET_ID == null) {
    console.error('No Google Sheet ID specified in .env file')
    process.exit()
} else {
    opensheetUrl = `https://opensheet.elk.sh/${process.env.GOOGLE_SHEET_ID}/1`
}

;(async () => {
    axios
        .get(opensheetUrl)
        .then(async (res) => {
            const data = await res.data
            let counter = 0

            for (let i = 0; i < 100; i++) {
                const profile = data[i]
                counter += 1

                await db.writeData([
                    profile.id,
                    profile.name,
                    profile.handle,
                    profile.followers,
                    profile.created,
                    profile.verified,
                    profile.twitter_pfp,
                    profile.ens_avatar
                ])
                console.log(`Wrote ${profile.name} to database`)
            }
            console.log(`\nWrote ${counter} profiles to database`)
            process.exit()
        })
        .catch(err => {
            console.log(err)
        })
})()
