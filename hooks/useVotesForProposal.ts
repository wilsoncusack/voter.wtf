import useSWR from 'swr';
import { useVoteDirections } from './useVoteDirections';
import { Vote } from '../types/Vote';

export function useVotesForProposal(id: string) {
  const { data, ...rest } = useSWR<Vote[]>(`/api/proposals/${id}/votes`);

  const { forVotes, againstVotes } = useVoteDirections(data);

  return { forVotes, againstVotes, ...rest };
}
