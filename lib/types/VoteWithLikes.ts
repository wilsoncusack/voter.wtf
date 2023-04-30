import { Vote } from '../services/subgraph.service';

export interface Like {
  id?: string;
  is_nouns_voter: boolean;
  created_at?: string;
  user: string;
  vote_id: string;
}

export interface VoteWithLikes extends Vote {
  nounHolderLikes: Like[];
  nonNounHolderLikes: Like[];
}
