const fs = require('fs')
const path = require('path')
const sharp = require('sharp')
const axios = require('axios')
const { Client } = require('pg')
const decache = require('decache')
const client = new Client(process.env.DATABASE_URL)
client.connect()

// Read data from PostgreSQL
async function readData (numberOfProfiles) {
    // If no number is specific, return 500 profiles
    if (numberOfProfiles == null) {
        numberOfProfiles = 500
    }

    try {
        return await client
            // sql query select * from frens where the name contains '.eth'
            .query(`SELECT * FROM frens WHERE LOWER(name) like '%.eth%' ORDER BY followers DESC LIMIT ${numberOfProfiles}`)
            .then(res => {
                // Save data to public/eth-profiles.json
                fs.writeFile('./public/eth-profiles.json', JSON.stringify(res.rows), (err) => {
                    if (err) { console.log(err) }
                })
                return res.rows
            })
    } catch (e) {
        return console.error('Error reading from database', e.stack)
    }
}

// Write data to PostgreSQL
async function writeData (data) {
    decache('./public/eth-profiles.json')
    return client
        .query({
            text: 'INSERT INTO frens (id, name, ens, handle, followers, created, verified, twitter_pfp, ens_avatar) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) ON CONFLICT (id) DO UPDATE SET name = $2, ens = $3, handle = $4, followers = $5, created = $6, verified = $7, twitter_pfp = $8, ens_avatar = $9',
            values: data
        })
        .then(res => {
            // console.log(`Wrote ${data[1]} to database`)
        })
        .catch(e => console.error('Error writing to database', e.stack))
}

async function getAvatar (ensName) {
    if (!ensName) return null

    const nameBeforeDot = ensName.split('.eth')[0]
    const url = `https://metadata.ens.domains/mainnet/avatar/${ensName}`

    try {
        await axios.get(url, { timeout: 8000 })
        // Save image at {url} to /public/avatars/{ensName}
        const image = await axios.get(url, { responseType: 'arraybuffer' })
        const imageBuffer = Buffer.from(image.data, 'binary')

        // Resize image
        const imageResized = await sharp(imageBuffer)
            .resize(128, 128)
            .toBuffer()
        fs.writeFileSync(path.join(__dirname, `/public/avatars/${nameBeforeDot}.png`), imageResized)
        return `/avatars/${nameBeforeDot}.png`
    } catch (err) {
        return '/avatars/default.png'
    }
}

module.exports = { readData, writeData, getAvatar }
