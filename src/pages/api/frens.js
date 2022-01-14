import { fetchInitialData } from "../../staticapi";

export default async (req, res) => {
  if (req.method === "GET") {
    console.log("FETCHING DATA FROM API", req.query);
    let { q, count, skip, verified } = req.query;
    if (count > 500) count = 500;
    count |= 100;
    skip |= 0;

    const data = await fetchInitialData(q, count, skip, verified);
    res.status(200);
    res.json(data);
  }
};
