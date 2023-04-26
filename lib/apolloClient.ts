import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';
import { SUBGRAPH_URL } from './constants';

const link = new HttpLink({
  uri: SUBGRAPH_URL, // Replace this with the correct subgraph URL
});

const cache = new InMemoryCache();

const apolloClient = new ApolloClient({
  link,
  cache,
});

export default apolloClient;
