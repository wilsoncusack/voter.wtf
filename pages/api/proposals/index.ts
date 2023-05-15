import { NextApiRequest, NextApiResponse } from 'next';
import { Order, subgraphService } from '../../../lib/services/subgraph.service';
import { Proposal as GqlProposal } from '../../../types/generated/nounsSubgraph';
import { Proposal } from '../../../types/Proposal';
import { computeProposalQuorumVotes, deriveProposalStatus } from '../../../lib';

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

    const gqlProposals = await subgraphService.getProposals(
      startBlockLimit,
      endBlockLimit,
      order,
      limit,
      offset
    );

    const proposals = gqlProposals.map((gqlProposal: GqlProposal) : Proposal => {
        const dynamicQuorum = computeProposalQuorumVotes(gqlProposal);
        const status = deriveProposalStatus(currentBlock, dynamicQuorum, gqlProposal);
      
        return {
          ...gqlProposal,
          status,
          dynamicQuorum
        };
      });

    res.status(200).json(proposals);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to get proposals' });
  }
}
