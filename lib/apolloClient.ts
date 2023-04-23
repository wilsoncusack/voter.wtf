import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

const link = new HttpLink({
  uri: 'https://api.thegraph.com/subgraphs/name/nounsdao/nouns-subgraph', // Replace this with the correct subgraph URL
});

const cache = new InMemoryCache();

const apolloClient = new ApolloClient({
  link,
  cache,
});

export default apolloClient;
