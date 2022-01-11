import axios from "axios";
import sharp from "sharp";
import { readFile, writeFile } from "fs/promises";

const cachedDir = "./cache/avatars";

function sendData(res, currentCached) {
  res.setHeader("Cache-Control", "s-maxage=43200");
  res.setHeader("content-type", currentCached.headers["content-type"]);
  return res.send(Buffer.from(currentCached.data, "binary"));
}

export default async (req, res) => {
  const { avatar: ensName } = req.query;
  if (!ensName) return res.status(404).send;

  try {
    const currentCached = await JSON.parse(
      await readFile(`${cachedDir}/${ensName}.json`)
    );
    if (
      currentCached &&
      currentCached.data &&
      currentCached.timestamp > Date.now() - 12 * 60 * 60 * 1000
    ) {
      return sendData(res, currentCached);
    } else {
      throw new Error("Not cached");
    }
  } catch {
    const url = `https://metadata.ens.domains/mainnet/avatar/${ensName}`;

    try {
      // Save image at {url} to /public/avatars/{ensName}
      const image = await axios.get(url, {
        responseType: "arraybuffer",
        timeout: 8000,
      });
      if (image.status !== 200) throw new Error("not found");
      const imageBuffer = Buffer.from(image.data, "binary");

      // Resize image
      const imageResized = await sharp(imageBuffer).resize(128, 128).toBuffer();

      const imgToSave = {
        data: imageResized,
        headers: image.headers,
        timestamp: Date.now(),
      };
      writeFile(`${cachedDir}/${ensName}.json`, JSON.stringify(imgToSave));

      return sendData(res, imgToSave);
    } catch (err) {
      const defaultImg = await readFile("./public/avatars/default.png");
      res.setHeader("Cache-Control", "s-maxage=43200");
      res.setHeader("content-type", "image/png");
      return res.send(defaultImg);
    }
  }
};
