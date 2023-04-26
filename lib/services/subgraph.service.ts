import { ApolloClient, gql, HttpLink, InMemoryCache } from '@apollo/client';
import * as process from 'process';

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
}

export const subgraphService = new SubgraphService(
  process.env.NEXT_PUBLIC_SUBGRAPH_URL || ''
);
