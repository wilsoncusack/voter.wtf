// pages/api/getProposalVotes.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { gql } from '@apollo/client';
import apolloClient from '../../lib/apolloClient';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { proposalId } = req.query;

  const { data } = await apolloClient.query({
    query: gql`
      query GetProposalVotes($proposalId: String!) {
        votes(
          where: { proposal: $proposalId }
          orderBy: blockNumber
          orderDirection: desc
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
    variables: {
      proposalId,
    },
  });

  res.setHeader('Cache-Control', 'no-store');
  res.status(200).json(data.votes);
}
