import { ProposalStatus } from '../types/Proposal';
import { Vote } from '../types/Vote';
import { Proposal, Vote as GqlVote} from '../types/generated/nounsSubgraph';
import { supabase } from './supabaseClient';

export const buildVotesWithLikes = async (votes: GqlVote[]) : Promise<Vote[]> => {
  const voteIds = votes.map(vote => `${vote.proposal.id}-${vote.voter.id}`);
  const voteLikes = await supabase
    .from('vote_likes')
    .select('vote_id, is_nouns_voter, user')
    .in('vote_id', voteIds);
  return votes.map(vote => {
    const id = `${vote.proposal.id}-${vote.voter.id}`;
    const likes = voteLikes.data.filter(like => like.vote_id === id);
    return {
      likes,
      ...vote,
    };
  });
};

export const computeProposalQuorumVotes = (proposal: Proposal): number => {
  const againstVotesBPS = (10000 * proposal.againstVotes) / proposal.totalSupply;
  const quorumAdjustmentBPS = (proposal.quorumCoefficient * againstVotesBPS) / 1e6;
  const adjustedQuorumBPS = proposal.minQuorumVotesBPS + quorumAdjustmentBPS;
  const dynamicQuorumBPS = Math.min(proposal.maxQuorumVotesBPS, adjustedQuorumBPS);
  return (dynamicQuorumBPS * proposal.totalSupply) / 10000;
}

export const deriveProposalStatus = (currentBlock: BigInt, dynamicQuorum: number, proposal: Proposal): ProposalStatus => {
  // Calculate the dynamic quorum
  if (currentBlock < proposal.startBlock) {
    return ProposalStatus.Pending;
  } else if (currentBlock >= proposal.startBlock && currentBlock <= proposal.endBlock) {
    return ProposalStatus.Active;
  } else if (currentBlock > proposal.endBlock) {
    if (proposal.forVotes >= dynamicQuorum) {
      return ProposalStatus.Passed;
    } else {
      return ProposalStatus.Defeated;
    }
  } else if (proposal.status === 'CANCELLED') {
    return ProposalStatus.Cancelled;
  } else {
    throw new Error("Unable to determine proposal status");
  }
};
