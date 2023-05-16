import { ApolloClient, gql, HttpLink, InMemoryCache } from '@apollo/client';
import { SUBGRAPH_URL } from '../constants';
import { VOTE_FRAGMENT } from './fragments';
import { Vote, Proposal } from '../../types/generated/nounsSubgraph';

export type Order = 'desc' | 'asc';

const GET_VOTES = gql`
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

const GET_VOTES_BY_VOTER = gql`
  query GetVotes($order: String, $limit: Int, $offset: Int, $voterId: String) {
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

const GET_VOTES_FOR_PROPOSAL = gql`
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

const GET_PROPOSALS = gql`
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

type FilterParams<T = object> = T & {
  order: Order;
  limit?: number;
  offset?: number;
};

export class SubgraphService {
  client: ApolloClient<any>;
  constructor(uri: string) {
    const link = new HttpLink({ uri });
    const cache = new InMemoryCache();
    this.client = new ApolloClient({
      link,
      cache,
    });
  }

  public async getProposals(
    startBlockLimit: string,
    endBlockLimit: string,
    order: Order,
    limit: number,
    offset: number
  ): Promise<Proposal[]> {
    const { data } = await this.client.query({
      query: GET_PROPOSALS,
      variables: {
        startBlockLimit,
        endBlockLimit,
        order,
        limit,
        offset,
      },
      fetchPolicy: 'network-only',
    });
    return data?.proposals || [];
  }

  public async getVotes(
    params: FilterParams<{ voterId?: string }>
  ): Promise<Vote[]> {
    const { order, limit = null, offset = 0, voterId } = params;
    const { data } = await this.client.query({
      query: params.voterId ? GET_VOTES_BY_VOTER : GET_VOTES,
      variables: {
        ...(voterId && {
          voterId: voterId.toLowerCase(),
        }),
        order,
        ...(limit && offset && { limit, offset }),
      },
      fetchPolicy: 'network-only',
    });
    return data?.votes || [];
  }

  public async getVotesForProposal(
    proposalId: string,
    order: Order,
    limit?: number,
    offset?: number
  ): Promise<Vote[]> {
    const { data } = await this.client.query({
      query: GET_VOTES_FOR_PROPOSAL,
      variables: {
        proposalId,
        order,
        ...(limit && offset && { limit, offset }),
      },
      fetchPolicy: 'network-only',
    });
    return data?.votes || [];
  }
}

export const subgraphService = new SubgraphService(SUBGRAPH_URL);
