import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';
import { SUBGRAPH_URL } from '../constants';
import {
  GetVotesQuery,
  GetVotesForProposalQuery,
  GetActiveProposalsWithVotesQuery,
} from '../../types/generated/nounsSubgraph';
import {
  GetProposalsDocument,
  GetProposalsQuery,
  OrderDirection,
  GetVotesDocument,
  GetVotesByVoterDocument,
  GetVotesForProposalDocument,
  GetActiveProposalsWithVotesDocument,
} from '../../types/generated/nounsSubgraph';

export type FilterParams<T = object> = T & {
  order: OrderDirection;
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
    order: OrderDirection,
    limit: number,
    offset: number
  ): Promise<GetProposalsQuery['proposals']> {
    const { data } = await this.client.query({
      query: GetProposalsDocument,
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
  ): Promise<GetVotesQuery['votes']> {
    const { order, limit = null, offset = 0, voterId } = params;
    const { data } = await this.client.query({
      query: params.voterId ? GetVotesByVoterDocument : GetVotesDocument,
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

  public async getActiveProposals(
    currentBlock: string
  ): Promise<GetActiveProposalsWithVotesQuery['proposals']> {
    const { data } = await this.client.query({
      query: GetActiveProposalsWithVotesDocument, // This is your GraphQL query
      variables: { currentBlock },
      fetchPolicy: 'network-only',
    });

    return data?.proposals || [];
  }

  public async getVotesForProposal(
    proposalId: string,
    order: OrderDirection,
    limit?: number,
    offset?: number
  ): Promise<GetVotesForProposalQuery['votes']> {
    const { data } = await this.client.query({
      query: GetVotesForProposalDocument,
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
