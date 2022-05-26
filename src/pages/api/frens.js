import { fetchInitialData } from "../../staticapi";

export default async (req, res) => {
  if (req.method === "GET") {
    console.log("FETCHING DATA FROM API", req.query);
    let { q, count, skip, verified, location } = req.query;
    // Limit to 100 results per page
    count ? (count > 100 ? (count = 100) : count) : (count = 100)
    skip |= 0;
    location ? location : null

    const data = await fetchInitialData(q, count, skip, verified, location);
    res.status(200);
    res.json(data);
  }
};
