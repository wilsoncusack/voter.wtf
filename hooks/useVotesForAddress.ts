import useSWR from 'swr';
import { useVoteDirections } from './useVoteDirections';
import { Vote } from '../types/Vote';

export function useVotesForAddress(address: string) {
  const { data, ...rest } = useSWR<Vote[]>(`/api/votes?voterId=${address}`);

  const { forVotes, againstVotes } = useVoteDirections(data);

  return { forVotes, againstVotes, votes: data, ...rest };
}
