import { useMemo } from 'react';
import { useAccount } from 'wagmi';
import { useActiveProposals } from './useActiveProposals';
import {
  GetActiveProposalsQuery,
  ProposalStatus,
} from '../types/generated/nounsSubgraph';

export function useVotableProposals(): GetActiveProposalsQuery['proposals'] {
  const { proposals } = useActiveProposals();
  const { address } = useAccount();

  const votableProposals = useMemo(() => {
    return proposals.filter(
      proposal =>
        !proposal.votes.some(
          vote => vote.voter.id === address?.toLowerCase()
        ) && proposal.status != ProposalStatus.Cancelled
    );
  }, [proposals, address]);

  return votableProposals;
}
