const fs = require('fs')
const path = require('path')
const sharp = require('sharp')
const axios = require('axios')
const { google } = require('googleapis')

const jwtClient = new google.auth.JWT(
	process.env.client_email,
	null,
	process.env.private_key.replace(/\\n/g, '\n'),
	['https://www.googleapis.com/auth/spreadsheets']
)

// Authenticate request
jwtClient.authorize((err) => {
	if (err) {
		console.log(err)
		return
	}
})

// Google Sheets API
const spreadsheetId = process.env.spreadsheetId
const sheetRange = 'database!A2:I'
const sheets = google.sheets('v4')

// Read data from Google Sheets
async function readData() {
	await reorderData()
	
	const data = []
	let response = await sheets.spreadsheets.values.get({
		auth: jwtClient,
		spreadsheetId,
		range: sheetRange
	})

	try {
		for (const row of response.data.values) {
			// Exclude profiles if they no longer have .eth names
			if (!row[1].toString().toLowerCase().includes('.eth')) continue

			data.push({
				id: row[0],
				name: row[1],
				handle: row[2],
				followers: row[3],
				created: row[4],
				verified: row[5],
				twitter_pfp: row[6],
				ens_pfp: row[7],
				tweeted: row[8],
			})
		}

		data.splice(500)

		// Save data to public/eth-profiles.json
		fs.writeFile('./public/eth-profiles.json', JSON.stringify(data), (err) => {
			if (err) console.log(err)
		})
	} catch (err) {
		console.log('Having trouble reading data from the Google Sheet.', err)
		return
	}

	return data
}

// Write data to Google Sheets
async function writeData(values) {
	const sheetResource = { values }
	const response = await sheets.spreadsheets.values.get({
		auth: jwtClient,
		spreadsheetId,
		range: sheetRange
	})

	// Check if the profile already exists based on the id
	let row = response.data.values.findIndex(row => row[0] === values[0][0])

	if (row === -1) {
		// If the id does not exist in the database, add a new row
		await sheets.spreadsheets.values.append({
			auth: jwtClient,
			spreadsheetId: spreadsheetId,
			range: sheetRange,
			resource: sheetResource,
			valueInputOption: 'USER_ENTERED',
		})
		// .then(() => console.log('Added new row'))
		.catch(err => console.log('Error adding row in Google Sheets.', err.errors[0].message))
	} else {
		// If the id does exist in the database, update the row
		await sheets.spreadsheets.values.update({
			auth: jwtClient,
			spreadsheetId,
			range: `database!A${row + 2}:H${row + 2}`,
			valueInputOption: 'USER_ENTERED',
			resource: sheetResource
		})
			// .then(() => console.log('Updated row in Google Sheets'))
			.catch(err => console.log('Error updating data in Google Sheets.', err.response.statusText))
	}
}

async function reorderData() {
	await removeDuplicateRows()
		.catch(() => console.log('Error removing duplicate rows.'))

	// Sort data in the Google Sheet descending by the number of followers
	await sheets.spreadsheets
		.batchUpdate({
			auth: jwtClient,
			spreadsheetId: spreadsheetId,
			resource: {
				requests: [
					{
						sortRange: {
							range: { sheetId: 0, startRowIndex: 1 },
							sortSpecs: [
								{
									dimensionIndex: 3,
									sortOrder: 'DESCENDING',
								},
							],
						},
					},
				],
			},
		})
		// .then(() => console.log('Reordered data in Google Sheets'))
		.catch((err) =>
			console.log(
				'Error reordering data in Google Sheets.',
				err.errors[0].message
			)
		)
	
	// Remove row from the Google Sheet if another row already exists with it's first column value
	async function removeDuplicateRows() {
		const response = await sheets.spreadsheets.values.get({
			auth: jwtClient,
			spreadsheetId,
			range: sheetRange
		})
	
		let rows = response.data.values
		let ids = []
	
		for (const row of rows) {
			ids.push(row[0])
		}
	
		for (const id of ids) {
			let index = ids.indexOf(id)
			if (ids.indexOf(id, index + 1) !== -1) {
				await sheets.spreadsheets.values.clear({
					auth: jwtClient,
					spreadsheetId,
					range: `database!A${index + 2}:H${index + 2}`
				})
				// .then(() => console.log('Removed duplicate row from Google Sheets'))
				.catch((err) =>
					console.log(
						'Error removing duplicate row from Google Sheets.',
						err.errors[0].message
					)
				)
			}
		}
	}
}

async function getAvatar(ensName) {
	if (ensName == null || ensName === '') throw err

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

module.exports = { readData, writeData, reorderData, getAvatar }
