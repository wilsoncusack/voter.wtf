import { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { subgraphService } from '../../../../lib/services/subgraph.service';
import { restrictHandlerMethods } from '../../../../lib/util/api';
import { buildVotesWithLikes } from '../../../../lib';

const QuerySchema = z.object({
  proposalId: z.string(),
  page: z.number().optional(),
  limit: z.number().optional(),
  order: z.enum(['desc', 'asc']).default('desc'),
});

type Query = z.infer<typeof QuerySchema>;
async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const query: Query = QuerySchema.parse(req.query);
    let data;
    if (query.page && query.limit) {
      const offset = (query.page - 1) * query.limit;
      data = await subgraphService.getVotesForProposal(
        query.proposalId,
        query.order,
        query.limit,
        offset
      );
    } else {
      data = await subgraphService.getVotesForProposal(
        query.proposalId,
        query.order
      );
    }
    data = await buildVotesWithLikes(data);
    res.setHeader('Cache-Control', 'no-cache');
    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      statusCode: 500,
      message: 'An error occurred while fetching proposal, please try again.',
    });
  }
}

export default restrictHandlerMethods(handler, ['GET']);
