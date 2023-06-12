import { useState } from 'react';
import { ShowVoteModalContext } from '../contexts/ShowVoteModal';

export function ShowVoteModalProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showVoteModal, setShowVoteModal] = useState(false);

  const value = { showVoteModal, setShowVoteModal };

  return (
    <ShowVoteModalContext.Provider value={value}>
      {children}
    </ShowVoteModalContext.Provider>
  );
}
