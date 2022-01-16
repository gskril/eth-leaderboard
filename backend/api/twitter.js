import { getAllFrens, updateFrens } from ".";
import { T } from "../index.js";
import { chunkArray, extractEns } from "../utils";

export async function updateTwitterLocation() {
  // Get number of registered ENS names from OpenSea
  const numOfEnsNames = await fetchEnsStats();

  // Update Twitter profile's location with number of registered names every minute
  T.post("account/update_profile", {
    location: numOfEnsNames === 0 ? "" : `${numOfEnsNames} names registered`,
  })
    // .then((res) => console.log('Updated location.'))
    .catch((err) => console.log("Error updating location.", err));
}

export async function getTwitterProfileByHandle(handle) {
  return T.get("users/show", { screen_name: handle }).then(async (res) => {
    return res.data;
  });
}

export async function tweetNewProfile(msg, name, handle, rank) {
  const tweet = `${name} entered the top 100 most followed Twitter accounts with a @ensdomains name at number ${rank}! \n\nWelcome @${handle} 🎉`;

  T.post("statuses/update", { status: tweet })
    .then((res) => {
      const tweetLink = `https://twitter.com/${res.data.user.screen_name}/status/${res.data.id_str}`;
      console.log("Posted tweet:", tweetLink);
      msg.lineReply(`Posted tweet: ${tweetLink}`);
    })
    .catch((err) =>
      console.log("Error posting tweet.", err.allErrors[0].message)
    );
}

const updateByChunk = async (formattedChunk) =>
  T.get("2/users/lookup", { user_id: formattedChunk })
    .then((res) =>
      res.data.map((profile) => ({
        id: profile.id_str,
        name: profile.name,
        ens: extractEns(profile.name.toLowerCase()),
        handle: profile.screen_name,
        followers: profile.followers_count,
        verified: profile.verified,
        twitterPicture: profile.profile_image_url_https,
      }))
    )
    .then((profiles) => updateFrens(profiles));

export async function refreshDatabase() {
  return getAllFrens()
    .then((allFrens) => chunkArray(allFrens, 100))
    .then((chunks) =>
      chunks.map((chunk) => chunk.map((fren) => fren.id).join(","))
    )
    .then((formattedChunks) =>
      Promise.all(
        formattedChunks.map((chunk, inx) =>
          updateByChunk(chunk).then(() => console.log(`Updated chunk ${inx}`))
        )
      )
    )
    .then(() => console.log(`Finished refreshing database at ${new Date()}`))
    .catch((err) =>
      console.log(`ERROR refreshing database at ${new Date()}:`, err)
    );
}
