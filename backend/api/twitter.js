import { getAllFrens, updateFrens } from ".";
import { T, T2 } from "../index.js";
import { chunkArray, extractEns, processArray } from "../utils";
import { fetchEnsStats } from "./external.js";

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
      msg.reply(`Posted tweet: ${tweetLink}`);
    })
    .catch((err) =>
      console.log("Error posting tweet.", err.allErrors[0].message)
    );
}

const fetchChunk = async (chunk) => {
  // console.log(chunk.split(",").length);
  return T2.get("users", {
    ids: chunk,
    "user.fields": "id,name,username,public_metrics,verified,profile_image_url",
  }).then((res) => [
    ...res.data.map((profile) => ({
      id: profile.id,
      name: profile.name,
      ens: extractEns(profile.name.toLowerCase()),
      handle: profile.username,
      followers: profile.public_metrics.followers_count,
      verified: profile.verified,
      twitter_pfp: profile.profile_image_url,
    })),
    ...(res.errors
      ? res.errors
          .filter((error) => error.detail.includes("suspended"))
          .map((suspendedProfile) => ({
            id: suspendedProfile.value,
            suspended: true,
          }))
      : []),
  ]);
};

const updateByChunks = async (chunkOfChunks) => {
  return Promise.all(
    chunkArray(chunkOfChunks, 100)
      .map((chunk) => chunk.map((fren) => fren.id).join(","))
      .map(fetchChunk)
  )
    .then((profilesArrays) => profilesArrays.flat())
    .then((profiles) => updateFrens(profiles));
};

export async function refreshDatabase() {
  const startTime = new Date();
  return getAllFrens()
    .then((allFrens) => chunkArray(allFrens, 10000))
    .then((chunkArrays) =>
      processArray(chunkArrays, (chunk) =>
        updateByChunks(chunk).then(() => console.log("Updated chunk"))
      )
    )
    .then(() => (new Date().getTime() - startTime.getTime()) / 1000)
    .then((timeTaken) =>
      console.log(
        `Finished refreshing database (took ${timeTaken}s) at ${new Date()}`
      )
    )
    .catch((err) =>
      console.log(`ERROR refreshing database at ${new Date()}:`, err)
    );
}
