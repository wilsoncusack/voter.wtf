import { Proposal, ProposalStatus } from '../types/Proposal';
import { Proposal as GqlProposal } from '../types/generated/nounsSubgraph';
import { Order, subgraphService } from './services/nounsSubgraph.service';

export const getActiveProposals = async (
  currentBlock: bigint
): Promise<Proposal[]> => {
  return await getProposals(
    currentBlock,
    (currentBlock + BigInt(100000)).toString(),
    currentBlock.toString(),
    'asc',
    100,
    0
  );
};

export const getProposals = async (
  currentBlock: bigint,
  startBlockLimit: string,
  endBlockLimit: string,
  order: Order,
  limit: number,
  offset: number
): Promise<Proposal[]> => {
  const gqlProposals = await subgraphService.getProposals(
    startBlockLimit,
    endBlockLimit,
    order,
    limit,
    offset
  );

  return gqlProposals.map((gqlProposal: GqlProposal): Proposal => {
    const dynamicQuorum = computeProposalQuorumVotes(gqlProposal);
    const status = deriveProposalStatus(
      currentBlock,
      dynamicQuorum,
      gqlProposal
    );

    return {
      ...gqlProposal,
      status,
      dynamicQuorum,
    };
  });
};

export const computeProposalQuorumVotes = (proposal: GqlProposal): number => {
  const againstVotesBPS =
    (10000 * proposal.againstVotes) / proposal.totalSupply;
  const quorumAdjustmentBPS =
    (proposal.quorumCoefficient * againstVotesBPS) / 1e6;
  const adjustedQuorumBPS = proposal.minQuorumVotesBPS + quorumAdjustmentBPS;
  const dynamicQuorumBPS = Math.min(
    proposal.maxQuorumVotesBPS,
    adjustedQuorumBPS
  );
  return (dynamicQuorumBPS * proposal.totalSupply) / 10000;
};

export const deriveProposalStatus = (
  currentBlock: bigint,
  dynamicQuorum: number,
  proposal: GqlProposal
): ProposalStatus => {
  // Calculate the dynamic quorum
  if (proposal.status === 'CANCELLED') {
    return ProposalStatus.Cancelled;
  } else if (currentBlock < proposal.startBlock) {
    return ProposalStatus.Pending;
  } else if (
    currentBlock >= proposal.startBlock &&
    currentBlock <= proposal.endBlock
  ) {
    return ProposalStatus.Voting;
  } else if (currentBlock > proposal.endBlock) {
    if (proposal.forVotes >= dynamicQuorum) {
      return ProposalStatus.Succeeded;
    } else {
      return ProposalStatus.Defeated;
    }
  } else {
    throw new Error('Unable to determine proposal status');
  }
};
