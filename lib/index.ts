import { Vote } from './services/subgraph.service';
import { supabase } from './supabaseClient';
import { VoteWithLikes } from './types/VoteWithLikes';

export const buildVotesWithLikes = async (votes: Vote[]) => {
  const voteIds = votes.map(vote => `${vote.proposal.id}-${vote.voter.id}`);
  const voteLikes = await supabase
    .from('vote_likes')
    .select('vote_id, is_nouns_voter, user')
    .in('vote_id', voteIds);

  return votes.map(vote => {
    const id = `${vote.proposal.id}-${vote.voter.id}`;
    const likes = voteLikes.data.filter(like => like.vote_id === id);
    return {
      nounHolderLikes: likes.filter(like => like.is_nouns_voter),
      nonNounHolderLikes: likes.filter(like => !like.is_nouns_voter),
      ...vote,
    };
  });
};

export function sortVotesByLikes(votes: VoteWithLikes[]) {
  return votes.sort(
    (a: VoteWithLikes, b: VoteWithLikes) =>
      b.nounHolderLikes.length +
      b.nonNounHolderLikes.length -
      (a.nounHolderLikes.length + a.nonNounHolderLikes.length)
  );
}
