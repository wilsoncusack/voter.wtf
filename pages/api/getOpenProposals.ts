import { NextApiRequest, NextApiResponse } from 'next';
import { gql } from '@apollo/client';
import apolloClient from '../../lib/apolloClient';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const block = (req.query.block as string) || '0';
  const { data } = await apolloClient.query({
    query: gql`
      query GetOpenProposals($block: String!) {
        openProposals: proposals(
          where: { endBlock_gt: $block, startBlock_lte: $block }
          orderBy: endBlock
          orderDirection: asc
          limit: 50
        ) {
          id
          title
          forVotes
          againstVotes
          endBlock
        }
      }
    `,
    variables: { block },
  });

  res.setHeader('Cache-Control', 'max-age=60');
  res.status(200).json(data.openProposals);
}
