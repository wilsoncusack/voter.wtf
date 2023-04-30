import { NextApiRequest, NextApiResponse } from 'next';
import { subgraphService } from '../../../lib/services/subgraph.service';
import { restrictHandlerMethods } from '../../../lib/util/api';
import { z } from 'zod';
import { supabase } from '../../../lib/supabaseClient';

const QuerySchema = z.object({
  page: z.coerce.number().default(0),
  limit: z.coerce.number().default(5),
  order: z.enum(['desc', 'asc']).default('desc'),
});

type Query = z.infer<typeof QuerySchema>;
async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const query: Query = QuerySchema.parse(req.query);
    const offset = (query.page - 1) * query.limit;
    const votes = await subgraphService.getVotes(
      query.order,
      query.limit,
      offset
    );
    const voteIds = votes.map(vote => `${vote.proposal.id}-${vote.voter.id}`);
    const voteLikes = await supabase
      .from('vote_likes')
      .select('vote_id, is_nouns_voter')
      .in('vote_id', voteIds);
    const votesWithLikes = votes.map(vote => {
      const id = `${vote.proposal.id}-${vote.voter.id}`;
      const likes = voteLikes.data.filter(like => like.vote_id === id);
      return {
        nounHolderLikes: likes.filter(like => like.is_nouns_voter).length,
        nonNounHolderLikes: likes.filter(like => !like.is_nouns_voter).length,
        ...vote,
      };
    });
    res.setHeader('Cache-Control', 'no-cache');
    res.status(200).json(votesWithLikes);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      statusCode: 500,
      message: 'An error occurred while fetching proposals, please try again.',
    });
  }
}

export default restrictHandlerMethods(handler, ['GET']);
