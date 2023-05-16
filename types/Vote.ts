import { Vote as GqlVote } from './generated/nounsSubgraph';

export interface Like {
  id?: string;
  is_nouns_voter: boolean;
  created_at?: string;
  user: string;
  vote_id: string;
}

export interface Vote extends GqlVote {
  likes: Like[];
}
