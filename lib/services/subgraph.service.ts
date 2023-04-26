import { ApolloClient, gql, HttpLink, InMemoryCache } from '@apollo/client';
import * as process from 'process';
import { Address } from 'wagmi';

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

const GET_VOTES = gql`
  query GetVotes($order: String, $limit: Int, $offset: Int) {
    votes(
      orderBy: blockNumber
      orderDirection: $order
      first: $limit
      skip: $offset
    ) {
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
  }
`;

const GET_OPEN_PROPOSALS = gql`
  query GetOpenProposals($order: String, $limit: Int, $offset: Int) {
    openProposals: proposals(
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
    order: 'desc' | 'asc',
    limit: number,
    offset: number
  ) {
    const { data } = await this.client.query({
      query: GET_OPEN_PROPOSALS,
      variables: {
        order,
        limit,
        offset,
      },
    });
    return data?.openProposals || [];
  }

  public async getVotes(
    order: 'desc' | 'asc',
    limit: number,
    offset: number
  ): Promise<Vote[]> {
    const { data } = await this.client.query({
      query: GET_VOTES,
      variables: {
        order,
        limit,
        offset,
      },
    });
    return data?.votes || [];
  }
}

export const subgraphService = new SubgraphService(
  process.env.NEXT_PUBLIC_SUBGRAPH_URL ||
    'https://api.thegraph.com/subgraphs/name/nounsdao/nouns-subgraph'
);
