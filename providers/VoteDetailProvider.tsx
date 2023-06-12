import { useState, FC } from 'react';
import { VoteDetailContext, VoteDetails } from '../contexts/VoteDetailsContext';
import { SupportDetailed } from '../types/Vote';
import { useVotableProposals } from '../hooks/useVotableProposals';

// This is your provider component that wraps part of your app.
export const VoteReasonProvider: FC = ({ children }) => {
  const proposals = useVotableProposals();
  const [voteDetail, setVoteDetail] = useState<VoteDetails>({
    proposalId: proposals.length > 0 ? proposals[0].id.toString() : '',
    support: SupportDetailed.For,
    reason: '\n\n*sent from voter.wtf*',
  });

  const value = { voteDetail, setVoteDetail };

  return (
    <VoteDetailContext.Provider value={value}>
      {children}
    </VoteDetailContext.Provider>
  );
};
