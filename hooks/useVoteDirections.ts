import { useMemo } from 'react';
import { Vote } from '../types/Vote';

const sortOnLikes = (a: Vote, b: Vote) => {
  if (!a.likes || !b.likes) return 0;
  if (a.reason && !b.reason) return -1;
  if (!a.reason && b.reason) return 1;

  const likeDiff = b.likes.length - a.likes.length;

  if (likeDiff === 0) {
    return b.votes - a.votes;
  }

  return likeDiff;
};

export function useVoteDirections<T extends Vote>(votes: T[] = []) {
  const forVotes = useMemo(
    () => votes?.filter((vote: Vote) => vote.support).sort(sortOnLikes),
    [votes]
  );

  const againstVotes = useMemo(
    () => votes?.filter((vote: Vote) => !vote.support).sort(sortOnLikes),
    [votes]
  );

  return {
    forVotes,
    againstVotes,
  };
}
