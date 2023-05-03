import useSWR from 'swr';
import { VoteWithLikes } from '../lib/types/VoteWithLikes';
import { useVoteDirections } from './useVoteDirections';

export function useVotesForAddress(address: string) {
  const { data, ...rest } = useSWR<VoteWithLikes[]>(
    `/api/votes?voterId=${address}`
  );

  const { forVotes, againstVotes } = useVoteDirections(data);

  return { forVotes, againstVotes, votes: data, ...rest };
}
