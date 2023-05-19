import { getAddress } from 'viem';
import { Vote } from '../types/Vote';
import { Vote as GqlVote } from '../types/generated/nounsSubgraph';
import { supabase } from './supabaseClient';
import { viem } from './wagmi';
import { normalize } from 'path';
import { FilterParams, subgraphService } from './services/subgraph.service';

export const buildVoteFromGqlVote = async (
  votes: GqlVote[]
): Promise<Vote[]> => {
  const voteIds = votes.map(vote => `${vote.proposal.id}-${vote.voter.id}`);
  const voteLikes = await supabase
    .from('vote_likes')
    .select('vote_id, is_nouns_voter, user')
    .in('vote_id', voteIds);
  return await Promise.all(
    votes.map(async vote => {
      const id = `${vote.proposal.id}-${vote.voter.id}`;
      const likes = voteLikes.data.filter(like => like.vote_id === id);
      const voterAddress = getAddress(vote.voter.id);
      const ensName = await viem.getEnsName({ address: voterAddress });
      const ensAvatar = await viem.getEnsAvatar({ name: normalize(ensName) });
      return {
        likes,
        ...vote,
        voter: {
          ensAvatar: ensAvatar,
          ensName: ensName,
          ...vote.voter,
        },
      };
    })
  );
};

export const getVotes = async (
  params: FilterParams<{ voterId?: string }>
): Promise<Vote[]> => {
  const gqlVotes = await subgraphService.getVotes(params);
  return await buildVoteFromGqlVote(gqlVotes);
};
