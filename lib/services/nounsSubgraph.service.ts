import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';
import { SUBGRAPH_URL } from '../constants';
import { Vote, Proposal } from '../../types/generated/nounsSubgraph';
import {
  GET_PROPOSALS,
  GET_VOTES,
  GET_VOTES_BY_VOTER,
  GET_VOTES_FOR_PROPOSAL,
} from '../../graphql/nouns';

export type Order = 'desc' | 'asc';

export type FilterParams<T = object> = T & {
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
        limit,
        offset,
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
        limit,
        offset,
      },
      fetchPolicy: 'network-only',
    });
    return data?.votes || [];
  }
}

export const subgraphService = new SubgraphService(SUBGRAPH_URL);
