import { ApolloClient, gql, HttpLink, InMemoryCache } from '@apollo/client';
import { Address } from 'wagmi';
import { SUBGRAPH_URL } from '../constants';
import { VOTE_FRAGMENT } from './fragments';

export interface Vote {
  id: string;
  vote: number;
  votes: number;
  support: boolean;
  supportDetailed: number;
  reason: string;
  voter: {
    id: Address;
  };
  proposal: {
    id: string;
    title: string;
  };
  blockNumber: number;
}

export interface Proposal {
  id: string;
  title: string;
  description: string;
  startBlock: number;
  endBlock: number;
  forVotes: number;
  againstVotes: number;
  status: string;
}

export type Order = 'desc' | 'asc';

const GET_VOTES = gql`
  query GetVotes($order: String, $limit: Int, $offset: Int) {
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
    $order: String
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

const GET_OPEN_PROPOSALS = gql`
  query GetOpenProposals(
    $currentBlock: String
    $order: String
    $limit: Int
    $offset: Int
  ) {
    openProposals: proposals(
      where: { endBlock_gt: $currentBlock, startBlock_lte: $currentBlock }
      orderBy: endBlock
      orderDirection: $order
      first: $limit
      skip: $offset
    ) {
      id
      title
      forVotes
      againstVotes
      endBlock
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

  public async getOpenProposals(
    currentBlock: string,
    order: Order,
    limit: number,
    offset: number
  ) {
    const { data } = await this.client.query({
      query: GET_OPEN_PROPOSALS,
      variables: {
        currentBlock,
        order,
        limit,
        offset,
      },
    });
    return data?.openProposals || [];
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
    });
    return data?.votes || [];
  }
}

export const subgraphService = new SubgraphService(SUBGRAPH_URL);
