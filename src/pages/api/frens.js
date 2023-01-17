import { fetchInitialData } from '../../staticapi';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const startTime = Date.now();
    console.log('FETCHING DATA FROM API', req.query);
    let { q, count, skip, verified, location } = req.query;
    // Limit to 100 results per page
    count ? (count > 500 ? (count = 500) : count) : (count = 100);
    skip |= 0;

    const data = await fetchInitialData(q, count, skip, verified, location);
    const endTime = Date.now();
    const diff = endTime - startTime;
    res.status(200);
    res.json({ ...data, response_time: diff });
  }
}
