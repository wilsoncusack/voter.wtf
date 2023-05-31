import { Vote } from '../types/Vote';
import { Vote as GqlVote } from '../types/generated/nounsSubgraph';
import { supabase } from './supabaseClient';
import {
  FilterParams,
  Order,
  subgraphService,
} from './services/nounsSubgraph.service';

export const getVotesForProposal = async (
  proposalId: string,
  order: Order,
  limit?: number,
  offset?: number
): Promise<Vote[]> => {
  const gqlVotes = await subgraphService.getVotesForProposal(
    proposalId,
    order,
    limit,
    offset
  );
  return await buildVoteFromGqlVote(gqlVotes);
};

export const getVotes = async (
  params: FilterParams<{ voterId?: string }>
): Promise<Vote[]> => {
  const gqlVotes = await subgraphService.getVotes(params);
  return await buildVoteFromGqlVote(gqlVotes);
};

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
      const ensInfo = await fetch(
        `https://api.ensideas.com/ens/resolve/${vote.voter.id}`
      ).then(res => res.json());
      const ensName = ensInfo.displayName;
      const ensAvatar = ensInfo.avatar;
      //   const voterAddress = getAddress(vote.voter.id);
      //   const ensName = await viem.getEnsName({ address: voterAddress });
      //   const ensAvatar = ensName
      //     ? await viem.getEnsAvatar({ name: normalize(ensName) })
      //     : null;
      return {
        likes,
        ...vote,
        voter: {
          ensAvatar: ensAvatar,
          ensName: ensName ? ensName : vote.voter.id.slice(0, 8),
          ...vote.voter,
        },
      };
    })
  );
};
