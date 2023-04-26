import { NextApiRequest, NextApiResponse } from 'next';
import { subgraphService } from '../../../lib/services/subgraph.service';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const method = req.method;
  if (method !== 'GET') {
    res.status(400).json({
      statusCode: 400,
      message: 'Only GET requests are allowed',
    });
    return;
  }
  try {
    // TODO - should service default
    const proposals = await subgraphService.getOpenProposals('desc', 10, 0);
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
