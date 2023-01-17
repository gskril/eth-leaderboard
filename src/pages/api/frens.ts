import { fetchInitialData } from '../../staticapi';
import { NextApiRequest, NextApiResponse } from 'next';
import zod from 'zod';

const querySchema = zod.object({
  q: zod.string().optional(),
  count: zod
    .string()
    .refine((val) => !isNaN(Number(val)))
    .optional(),
  skip: zod
    .string()
    .refine((val) => !isNaN(Number(val)))
    .optional(),
  verified: zod.boolean().optional(),
  location: zod.string().optional(),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Validate query params via zod safeParse
  const safeParse = querySchema.safeParse(req.query);
  if (!safeParse.success) {
    res.status(400);
    res.json({ error: safeParse.error });
    return;
  }

  const query = safeParse.data;

  const startTime = Date.now();
  console.log('FETCHING DATA FROM API', query);
  let { q, count: _count, skip: _skip, verified, location } = query;
  let count = Number(_count);
  let skip = Number(_skip);

  // Limit to 500 results per response, and default to 100 if no count is provided
  if (count) {
    if (count > 500) {
      count = 500;
    }
  } else {
    count = 100;
  }

  const data = await fetchInitialData({ q, count, skip, verified, location });
  const endTime = Date.now();
  const diff = endTime - startTime;
  res.status(200);
  res.json({ ...data, response_time: diff });
}
