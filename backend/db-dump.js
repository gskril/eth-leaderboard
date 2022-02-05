import { addFrens } from "./api/db.js";
import { chunkArray, extractEns } from "./utils";
import { T } from "./index.js";

import * as fs from 'fs';
const profiles = JSON.parse(fs.readFileSync(''))
const handles = profiles.map(p => p.handle)

const chunks = chunkArray(handles, 100)
let allProfiles = []
for (let i = 0; i < chunks.length; i++) {
  const commaSeparatedHandles = chunks[i].join(',')
  allProfiles.push(await lookupUsers(commaSeparatedHandles))
  console.log(`Got chunk of Twitter accounts`)
}

// Combine all profiles into one array
allProfiles = allProfiles.reduce((acc, curr) => acc.concat(curr), [])

await addFrens(allProfiles)
  .then((res) => console.log(`Added/updated ${allProfiles.length} lines in the database`))
  .then(() => process.exit())

async function lookupUsers(commaSeparatedHandles) {
	return await T.get('users/lookup', { screen_name: commaSeparatedHandles })
    .then(async (res) => {
      const data = res.data
      return data.map(p => {
        return {
          id: p.id_str,
          handle: p.screen_name,
          name: p.name,
          ens: extractEns(p.name),
          followers: p.followers_count,
          created: new Date(),
          verified: p.verified,
          twitter_pfp: p.profile_image_url_https
        }
      })
    })
    .catch(err => console.log(err))
}
