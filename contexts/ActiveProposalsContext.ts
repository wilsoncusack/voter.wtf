import { createContext } from 'react';
import { GetActiveProposalsWithVotesQuery } from '../types/generated/nounsSubgraph';

type ActiveProposalsContextType = {
  proposals: GetActiveProposalsWithVotesQuery['proposals'];
  loading: boolean;
};

export const ActiveProposalsContext = createContext<
  ActiveProposalsContextType | undefined
>(undefined);
