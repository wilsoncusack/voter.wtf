import { Proposal, Vote } from '../pages';
import useSWR from 'swr';

export type FeedProps = {
  initialProposals?: Proposal[];
  initialVotes?: Vote[];
};

export function Feed({ initialProposals = [], initialVotes = [] }: FeedProps) {
  const { data: proposals = initialProposals } = useSWR('/api/proposals');
  const { data: votes = initialVotes } = useSWR('/api/votes');

  return (
    <div>
      {proposals.length} Proposals
      {votes.length} Votes
    </div>
  );
}
