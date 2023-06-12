import { useContext } from 'react';
import { VoteDetailContext } from '../contexts/VoteDetailsContext';

export function useVoteDetail() {
  const context = useContext(VoteDetailContext);
  if (!context) {
    throw new Error('useVoteDetail must be used within a VoteDetailProvider');
  }
  return context;
}
