import { useContext } from 'react';
import { ShowVoteModalContext } from '../contexts/ShowVoteModal';

export function useShowVoteModal() {
  const context = useContext(ShowVoteModalContext);
  if (!context) {
    throw new Error(
      'useShowVoteModal must be used within a ShowVoteModalProvider'
    );
  }
  return context;
}
