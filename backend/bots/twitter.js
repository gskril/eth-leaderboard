import { addFren, addFrens, getTwitterProfileByHandle } from "../api";
import { T } from "../index.js";
import { extractEns } from "../utils";

export function start() {
  const stream = T.stream("statuses/filter", { track: "@ethleaderboard" });

  stream.on("tweet", async function (tweet) {
    const tweeter = { screen_name: tweet.user.screen_name };
    const mentionedAccounts = tweet.entities.user_mentions;

    // Add tweeter to array of tagged accounts
    mentionedAccounts.push(tweeter);

    // Ignore the tweet if doesn't mention anyone
    if (mentionedAccounts.length === 0) return;

    for (let i = 0; i < mentionedAccounts.length; i++) {
      const account = mentionedAccounts[i];

      // Ignore tags of @ethleaderboard
      if (account.screen_name === "ethleaderboard") continue;

      // Add each mentioned user to the database
      const handle = account.screen_name;
      const profile = await getTwitterProfileByHandle(handle);
      const ens = extractEns(profile.name.toLowerCase());

      try {
        await addFren({
          id: profile.id_str,
          name: profile.name,
          ens: ens,
          handle: profile.screen_name,
          followers: profile.followers_count,
          created: new Date(),
          verified: profile.verified,
          twitter_pfp: profile.profile_image_url_https,
        }).then(() => console.log(`Added @${handle} to the database`));
      } catch (err) {
        console.log("Error writing to database from Twitter monitor", err);
      }
    }
  });
}

export function searchTwitterUsers(page) {
  T.get('users/search', {
    q: '.eth',
    count: 20,
    include_entities: false,
    page: page,
  })
    .then(async (res) => {
      const data = res.data
      const allProfiles = []

      if (data.length >= 1) {
        for (let i = 0; i < data.length; i++) {
          const profile = data[i];
          const ens = extractEns(profile.name.toLowerCase());

					if (profile.name.includes('.eth')) {
						try {
              allProfiles.push({
                id: profile.id_str,
                name: profile.name,
                ens: ens,
                handle: profile.screen_name,
                followers: profile.followers_count,
                created: new Date(),
                verified: profile.verified,
                twitter_pfp: profile.profile_image_url_https,
              })
            } catch (err) {
              console.log("Error writing to database from Twitter monitor", err);
            }
					}
				}
      } else {
        return console.log('No more profiles to add')
      }
      
      await addFrens(allProfiles)
        .then(console.log(`Added/updated ${allProfiles.length} profiles in the database on page ${page}`))
      
      page = page + 1
      searchTwitterUsers(page)
    })
    .catch(err => {
      console.log('Error fetching data from Twitter API', err)
    })
}