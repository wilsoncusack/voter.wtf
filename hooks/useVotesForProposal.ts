import useSWR from 'swr';
import { useMemo } from 'react';
import { Vote } from '../types/Vote';

export function useVotesForProposal(id: string) {
  const { data, ...rest } = useSWR<Vote[]>(`/api/proposals/${id}/votes`);

  const forVotes = useMemo(
    () => data?.filter((vote: Vote) => vote.support).sort(sortOnLikes),
    [data]
  );

  const againstVotes = useMemo(
    () => data?.filter((vote: Vote) => !vote.support).sort(sortOnLikes),
    [data]
  );

  return { forVotes, againstVotes, ...rest };
}

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
