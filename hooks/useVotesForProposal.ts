import useSWR from 'swr';
import { Vote } from '../types/Vote';

export function useVotesForProposal(id: string) {
  const { data } = useSWR<Vote[]>(`/api/proposals/${id}/votes`);

  return { votes: data };
}
