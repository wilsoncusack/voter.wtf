import { Proposal } from '../pages';
import useSWR from 'swr';

export type FeedProps = {
  initialProposals?: Proposal[];
};

export function Feed({ initialProposals = [] }: FeedProps) {
  const { data = initialProposals, error } = useSWR('/api/proposals');

  return <div>{initialProposals.length} Found</div>;
}
