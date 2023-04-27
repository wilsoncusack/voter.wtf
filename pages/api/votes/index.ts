import { NextApiRequest, NextApiResponse } from 'next';
import { subgraphService } from '../../../lib/services/subgraph.service';
import { restrictHandlerMethods } from '../../../lib/util/api';
import { z } from 'zod';

const QuerySchema = z.object({
  page: z.coerce.number().default(0),
  limit: z.coerce.number().default(10),
  order: z.enum(['desc', 'asc']).default('desc'),
});

type Query = z.infer<typeof QuerySchema>;
async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const query: Query = QuerySchema.parse(req.query);
    const offset = (query.page - 1) * query.limit;
    const proposals = await subgraphService.getVotes(
      query.order,
      query.limit,
      offset
    );
    res.setHeader('Cache-Control', 'no-cache');
    res.status(200).json(proposals);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      statusCode: 500,
      message: 'An error occurred while fetching proposal, please try again.',
    });
  }
}

export default restrictHandlerMethods(handler, ['GET']);
