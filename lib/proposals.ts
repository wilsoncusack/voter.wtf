import { Proposal, ProposalStatus } from '../types/Proposal';
import {
  Proposal as GqlProposal,
  OrderDirection,
} from '../types/generated/nounsSubgraph';
import { subgraphService } from './services/nounsSubgraph.service';

export const getActiveProposals = async (
  currentBlock: bigint
): Promise<Proposal[]> => {
  return await getProposals(
    currentBlock,
    (currentBlock + BigInt(100000)).toString(),
    currentBlock.toString(),
    OrderDirection.Asc,
    100,
    0
  );
};

export const getProposals = async (
  currentBlock: bigint,
  startBlockLimit: string,
  endBlockLimit: string,
  order: OrderDirection,
  limit: number,
  offset: number
): Promise<Proposal[]> => {
  const gqlProposals = (await subgraphService.getProposals(
    startBlockLimit,
    endBlockLimit,
    order,
    limit,
    offset
  )) as GqlProposal[];

  return gqlProposals.map(
    (gqlProposal: GqlProposal): Proposal =>
      proposalFromGqlProposal(currentBlock, gqlProposal)
  );
};

export const proposalFromGqlProposal = (
  currentBlock: bigint,
  gqlProposal: GqlProposal
): Proposal => {
  const dynamicQuorum = computeProposalQuorumVotes(gqlProposal);
  const status = deriveProposalStatus(currentBlock, dynamicQuorum, gqlProposal);

  return {
    ...gqlProposal,
    status,
    dynamicQuorum,
  };
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

export function getStatusColor(status: ProposalStatus) {
  switch (status) {
    case ProposalStatus.Voting:
      return 'text-green-400';
    case ProposalStatus.Succeeded:
      return 'text-green-600';
    case ProposalStatus.Defeated:
      return 'text-red-500';
    default:
      return 'text-gray-500';
  }
}
