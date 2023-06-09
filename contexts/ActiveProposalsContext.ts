import { createContext } from 'react';
import { GetActiveProposalsQuery } from '../types/generated/nounsSubgraph';

type ActiveProposalsContextType = {
  proposals: GetActiveProposalsQuery['proposals'];
  loading: boolean;
};

export const ActiveProposalsContext = createContext<
  ActiveProposalsContextType | undefined
>(undefined);
