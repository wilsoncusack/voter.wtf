import { NextApiRequest, NextApiResponse } from 'next';
import { subgraphService } from '../../../lib/services/subgraph.service';
import { restrictHandlerMethods } from '../../../lib/util/api';
import { z } from 'zod';
import { buildVotesWithLikes } from '../../../lib';

const QuerySchema = z.object({
  page: z.coerce.number().default(1),
  limit: z.coerce.number().default(10),
  order: z.enum(['desc', 'asc']).default('desc'),
  voterId: z.string().optional(),
});

type Query = z.infer<typeof QuerySchema>;
async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const query: Query = QuerySchema.parse(req.query);
    const offset = (query.page - 1) * query.limit;
    const votes = await subgraphService.getVotes({
      order: query.order,
      limit: query.limit,
      offset,
      voterId: query.voterId,
    });
    const votesWithLikes = await buildVotesWithLikes(votes);
    res.setHeader('Cache-Control', 'no-cache');
    res.status(200).json(votesWithLikes);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      statusCode: 500,
      message: 'An error occurred while fetching proposals, please try again.',
    });
  }
}

export default restrictHandlerMethods(handler, ['GET']);
