import useSWR from 'swr';
import { Vote } from '../lib/services/subgraph.service';
import { useMemo } from 'react';
import { VoteWithLikes } from '../lib/types/VoteWithLikes';

export function useVotesForProposal(id: string) {
  const { data, ...rest } = useSWR<VoteWithLikes[]>(
    `/api/proposals/${id}/votes`
  );

  const forVotes = useMemo(
    () => data?.filter((vote: Vote) => vote.support),
    [data]
  );

  const againstVotes = useMemo(
    () => data?.filter((vote: Vote) => !vote.support),
    [data]
  );

  return { forVotes, againstVotes, ...rest };
}
