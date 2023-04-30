import { Vote } from '../services/subgraph.service';

export interface VoteWithLikes extends Vote {
  nounHolderLikes: number;
  nonNounHolderLikes: number;
}
