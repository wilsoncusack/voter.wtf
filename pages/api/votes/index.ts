import { NextApiRequest, NextApiResponse } from 'next';
import { restrictHandlerMethods } from '../../../lib/util/api';
import { z } from 'zod';
import { getVotes } from '../../../lib/votes';
import { OrderDirection } from '../../../types/generated/nounsSubgraph';

const QuerySchema = z.object({
  page: z.coerce.number().default(1),
  limit: z.coerce.number().default(10),
  order: z
    .enum([OrderDirection.Desc, OrderDirection.Asc])
    .default(OrderDirection.Desc),
  voterId: z.string().optional(),
});

type Query = z.infer<typeof QuerySchema>;
async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const query: Query = QuerySchema.parse(req.query);
    const offset = (query.page - 1) * query.limit;
    const votes = await getVotes({
      order: query.order,
      limit: query.limit,
      offset,
      voterId: query.voterId,
    });
    res.setHeader('Cache-Control', 'no-cache');
    res.status(200).json(votes);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      statusCode: 500,
      message: 'An error occurred while fetching proposals, please try again.',
    });
  }
}

export default restrictHandlerMethods(handler, ['GET']);
