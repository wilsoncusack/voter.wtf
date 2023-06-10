import { Vote as GqlVote, Delegate } from './generated/nounsSubgraph';

export enum SupportDetailed {
  Against = 0,
  For = 1,
  Abstain = 2,
}

export interface Like {
  id?: string;
  is_nouns_voter: boolean;
  created_at?: string;
  user: string;
  vote_id: string;
}

export interface Voter extends Delegate {
  ensName: string | null;
  ensAvatar: string | null;
}

export interface Vote extends Omit<GqlVote, 'voter'> {
  likes: Like[];
  voter: Voter;
}
