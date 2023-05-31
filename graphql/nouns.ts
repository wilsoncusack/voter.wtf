import { gql } from '@apollo/client';

// Maybe we want to should use an actual graphql file here, but just copying over the typescript file for now

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

export const GET_VOTES = gql`
  query GetVotes($order: OrderDirection, $limit: Int, $offset: Int) {
    votes(
      orderBy: blockNumber
      orderDirection: $order
      first: $limit
      skip: $offset
    ) {
      ...VoteFragment
    }
  }
  ${VOTE_FRAGMENT}
`;

export const GET_VOTES_BY_VOTER = gql`
  query GetVotesByVoter(
    $order: OrderDirection
    $limit: Int
    $offset: Int
    $voterId: String
  ) {
    votes(
      where: { voter: $voterId }
      orderBy: blockNumber
      orderDirection: $order
      first: $limit
      skip: $offset
    ) {
      ...VoteFragment
    }
  }
  ${VOTE_FRAGMENT}
`;

export const GET_VOTES_FOR_PROPOSAL = gql`
  query GetVotesForProposal(
    $proposalId: String!
    $order: OrderDirection
    $limit: Int
    $offset: Int
  ) {
    votes(
      where: { proposal: $proposalId }
      orderBy: blockNumber
      orderDirection: $order
      first: $limit
      skip: $offset
    ) {
      ...VoteFragment
    }
  }
  ${VOTE_FRAGMENT}
`;

export const GET_PROPOSALS = gql`
  query GetProposals(
    $startBlockLimit: BigInt
    $endBlockLimit: BigInt
    $order: OrderDirection
    $limit: Int
    $offset: Int
  ) {
    proposals: proposals(
      where: { endBlock_gt: $endBlockLimit, startBlock_lte: $startBlockLimit }
      orderBy: endBlock
      orderDirection: $order
      first: $limit
      skip: $offset
    ) {
      id
      title
      forVotes
      againstVotes
      abstainVotes
      totalSupply
      minQuorumVotesBPS
      maxQuorumVotesBPS
      quorumCoefficient
      createdTimestamp
      createdBlock
      startBlock
      status
      endBlock
      quorumVotes
    }
  }
`;
