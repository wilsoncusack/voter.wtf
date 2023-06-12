import { Vote } from '../types/Vote';
import {
  Vote as GqlVote,
  OrderDirection,
} from '../types/generated/nounsSubgraph';
import { supabase } from './supabaseClient';
import {
  FilterParams,
  subgraphService,
} from './services/nounsSubgraph.service';
import { getENSInfo } from './services/basement.service';

export const getVotesForProposal = async (
  proposalId: string,
  order: OrderDirection,
  limit?: number,
  offset?: number
): Promise<Vote[]> => {
  const gqlVotes = await subgraphService.getVotesForProposal(
    proposalId,
    order,
    limit,
    offset
  );
  return await buildVoteFromGqlVote(gqlVotes as Vote[]);
};

export const getVotes = async (
  params: FilterParams<{ voterId?: string }>
): Promise<Vote[]> => {
  const gqlVotes = await subgraphService.getVotes(params);
  return await buildVoteFromGqlVote(gqlVotes as Vote[]);
};

export const buildVoteFromGqlVote = async (
  votes: GqlVote[]
): Promise<Vote[]> => {
  const voteIds = votes.map(vote => `${vote.proposal.id}-${vote.voter.id}`);
  const voteLikes = await supabase
    .from('vote_likes')
    .select('vote_id, is_nouns_voter, user')
    .in('vote_id', voteIds);
  const ensInfo = await getENSInfo(votes.map(vote => vote.voter.id));
  return await Promise.all(
    votes.map(async vote => {
      const id = `${vote.proposal.id}-${vote.voter.id}`;
      const likes = voteLikes.data?.filter(like => like.vote_id === id) || [];
      const ens = ensInfo.find(
        ens => ens.address.toLowerCase() === vote.voter.id
      );
      let ensName;
      let ensAvatar;
      if (ens && ens.reverseProfile) {
        ensName = ens.reverseProfile.name;
        ensAvatar = ens.reverseProfile.avatarUrl;
      }

      return {
        likes,
        ...vote,
        voter: {
          ensAvatar: ensAvatar || null,
          ensName: ensName ? ensName : vote.voter.id.slice(0, 8),
          ...vote.voter,
        },
      };
    })
  );
};
