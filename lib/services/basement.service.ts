import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';
import { GetEnsInfoDocument } from '../../types/generated/basement';

const BASEMENT_API_KEY = process.env.BASEMENT_API_KEY;

const client = new ApolloClient({
  link: new HttpLink({
    uri: 'https://beta.basement.dev/v2/graphql',
    headers: {
      'X-Basement-API-Key': BASEMENT_API_KEY,
    },
  }),
  cache: new InMemoryCache(),
});

export async function getENSInfo(addresses: string[]) {
  const { data } = await client.query({
    query: GetEnsInfoDocument,
    variables: { addresses },
    fetchPolicy: 'network-only',
  });

  return data?.addresses || [];
}
