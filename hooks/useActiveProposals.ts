import { useContext } from 'react';
import { ActiveProposalsContext } from '../contexts/ActiveProposalsContext';

export const useActiveProposals = () => {
  const context = useContext(ActiveProposalsContext);
  if (!context) {
    throw new Error(
      'useActiveProposals must be used within a ActiveProposalsProvider'
    );
  }
  return context;
};
