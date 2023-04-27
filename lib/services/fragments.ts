import { gql } from '@apollo/client';

export const VOTE_FRAGMENT = gql`
  fragment VoteFragment on Vote {
    id
    support
    supportDetailed
    votes
    reason
    voter {
      id
    }
    proposal {
      id
      title
    }
    blockNumber
  }
`;
