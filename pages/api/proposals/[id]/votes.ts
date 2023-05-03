import { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { subgraphService } from '../../../../lib/services/subgraph.service';
import { restrictHandlerMethods } from '../../../../lib/util/api';
import { buildVotesWithLikes, sortVotesByLikes } from '../../../../lib';

const QuerySchema = z.object({
  id: z.string(),
  page: z.number().optional(),
  limit: z.number().optional(),
  order: z.enum(['desc', 'asc']).default('desc'),
  // TODO - make orderBy blocknumber optional / mature available filters
  orderBy: z.array(z.enum(['likes'])).default(['likes']),
});

type Query = z.infer<typeof QuerySchema>;
async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const query: Query = QuerySchema.parse(req.query);
    let data;
    if (query.page && query.limit) {
      const offset = (query.page - 1) * query.limit;
      data = await subgraphService.getVotesForProposal(
        query.id,
        query.order,
        query.limit,
        offset
      );
    } else {
      data = await subgraphService.getVotesForProposal(query.id, query.order);
    }
    data = await buildVotesWithLikes(data);
    if (query.orderBy.includes('likes')) {
      data = sortVotesByLikes(data);
    }
    res.setHeader('Cache-Control', 'no-cache');
    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      statusCode: 500,
      message: 'An error occurred while fetching proposals, please try again.',
    });
  }
}

export default restrictHandlerMethods(handler, ['GET']);
