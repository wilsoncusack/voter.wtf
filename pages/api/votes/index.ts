import { NextApiRequest, NextApiResponse } from 'next';
import { subgraphService } from '../../../lib/services/subgraph.service';
import { restrictHandlerMethods } from '../../../lib/util/api';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // TODO - should service default
    const proposals = await subgraphService.getVotes('desc', 25, 0);
    res.setHeader('Cache-Control', 'no-cache');
    res.status(200).json(proposals);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      statusCode: 500,
      message: 'An error occurred while fetching proposals, please try again.',
    });
  }
}

export default restrictHandlerMethods(handler, ['GET']);
