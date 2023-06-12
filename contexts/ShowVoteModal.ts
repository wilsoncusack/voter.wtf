import { createContext, Dispatch, SetStateAction } from 'react';

type ShowVoteModalContextType = {
  showVoteModal: boolean;
  setShowVoteModal: Dispatch<SetStateAction<boolean>>;
};

export const ShowVoteModalContext = createContext<
  ShowVoteModalContextType | undefined
>(undefined);
