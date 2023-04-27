import useSWR from 'swr';
import { Vote } from '../lib/services/subgraph.service';
import { useMemo } from 'react';

export function useVotesForProposal(proposalId: string) {
  const { data, ...rest } = useSWR<Vote[]>(`api/proposal/${proposalId}/votes`);

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
