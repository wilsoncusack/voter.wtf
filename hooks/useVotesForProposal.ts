import useSWR from 'swr';
import { Vote } from '../lib/services/subgraph.service';
import { useMemo } from 'react';
import { VoteWithLikes } from '../lib/types/VoteWithLikes';

export function useVotesForProposal(id: string) {
  const { data, ...rest } = useSWR<VoteWithLikes[]>(
    `/api/proposals/${id}/votes`
  );

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

const sortOnLikes = (a: VoteWithLikes, b: VoteWithLikes) => {
  if (!a.nounHolderLikes || !b.nounHolderLikes) return 0;
  return (
    b.nonNounHolderLikes.length +
    b.nounHolderLikes.length -
    (a.nonNounHolderLikes.length + a.nounHolderLikes.length)
  );
};
