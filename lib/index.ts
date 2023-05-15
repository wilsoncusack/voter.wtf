import { Vote } from '../types/Vote';
import { Vote as GqlVote } from '../types/generated/nounsSubgraph';
import { supabase } from './supabaseClient';

export const buildVotesWithLikes = async (
  votes: GqlVote[]
): Promise<Vote[]> => {
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
