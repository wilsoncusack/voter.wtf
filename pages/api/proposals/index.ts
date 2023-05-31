import { NextApiRequest, NextApiResponse } from 'next';
import { getProposals } from '../../../lib/proposals';
import { Order } from '../../../lib/services/nounsSubgraph.service';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const currentBlock = BigInt(req.query.currentBlock as string);
    const startBlockLimit = req.query.startBlockLimit as string;
    const endBlockLimit = req.query.endBlockLimit as string;
    const order = req.query.order as Order;
    const limit = Number(req.query.limit);
    const offset = Number(req.query.offset);

    res
      .status(200)
      .json(
        await getProposals(
          currentBlock,
          startBlockLimit,
          endBlockLimit,
          order,
          limit,
          offset
        )
      );
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to get proposals' });
  }
}
