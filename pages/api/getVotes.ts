import { NextApiRequest, NextApiResponse } from 'next';
import { gql } from '@apollo/client';
import apolloClient from '../../lib/apolloClient';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const skip = parseInt(req.query.skip as string) || 0;

  const { data } = await apolloClient.query({
    query: gql`
      query GetVotes($skip: Int!) {
        votes(
          orderBy: blockNumber
          orderDirection: desc
          first: 20
          skip: $skip
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
    `,
    variables: { skip },
  });
  res.setHeader('Cache-Control', 'no-store');
  res.status(200).json(data.votes);
}
