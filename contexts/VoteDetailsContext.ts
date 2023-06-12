import { createContext, Dispatch, SetStateAction } from 'react';
import { SupportDetailed } from '../types/Vote';

export type VoteDetails = {
  proposalId: string;
  support: SupportDetailed;
  reason: string;
};
// Define the context type
type VoteDetailContextType = {
  voteDetail: VoteDetails;
  setVoteDetail: Dispatch<SetStateAction<VoteDetails>>;
};

// Initialize a context with a default value
export const VoteDetailContext = createContext<
  VoteDetailContextType | undefined
>(undefined);
