import { Vote } from './services/subgraph.service';
import { supabase } from './supabaseClient';

export const buildVotesWithLikes = async (votes: Vote[]) => {
  const voteIds = votes.map(vote => `${vote.proposal.id}-${vote.voter.id}`);
  const voteLikes = await supabase
    .from('vote_likes')
    .select('vote_id, is_nouns_voter')
    .in('vote_id', voteIds);
  const votesWithLikes = votes.map(vote => {
    const id = `${vote.proposal.id}-${vote.voter.id}`;
    const likes = voteLikes.data.filter(like => like.vote_id === id);
    return {
      nounHolderLikes: likes.filter(like => like.is_nouns_voter).length,
      nonNounHolderLikes: likes.filter(like => !like.is_nouns_voter).length,
      ...vote,
    };
  });
  return votesWithLikes;
};
