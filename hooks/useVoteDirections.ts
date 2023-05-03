import { useMemo } from 'react';
import { VoteWithLikes } from '../lib/types/VoteWithLikes';

const sortOnLikes = (a: VoteWithLikes, b: VoteWithLikes) => {
  if (!a.nounHolderLikes || !b.nounHolderLikes) return 0;
  return (
    b.nonNounHolderLikes.length +
    b.nounHolderLikes.length -
    (a.nonNounHolderLikes.length + a.nounHolderLikes.length)
  );
};

export function useVoteDirections<T extends VoteWithLikes>(votes: T[] = []) {
  const forVotes = useMemo(
    () =>
      votes?.filter((vote: VoteWithLikes) => vote.support).sort(sortOnLikes),
    [votes]
  );

  const againstVotes = useMemo(
    () =>
      votes?.filter((vote: VoteWithLikes) => !vote.support).sort(sortOnLikes),
    [votes]
  );

  return {
    forVotes,
    againstVotes,
  };
}
