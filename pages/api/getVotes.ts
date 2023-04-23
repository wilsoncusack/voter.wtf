import { NextApiRequest, NextApiResponse } from 'next';
import { gql } from '@apollo/client';
import apolloClient from '../../lib/apolloClient';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { data } = await apolloClient.query({
    query: gql`
      query GetVotes {
        votes(orderBy: blockNumber, orderDirection: desc, first: 20) {
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
    `,
  });

  res.status(200).json(data.votes);
}
