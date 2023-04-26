import { SWRConfig } from 'swr';
import { Feed } from '../compositions/Feed';
import { FallbackProp } from '../lib/util/swr';
import { subgraphService } from '../lib/services/subgraph.service';

type FeedPageProps = {
  fallback: FallbackProp;
};

export default function FeedPage({ fallback }: FeedPageProps) {
  return (
    <SWRConfig value={{ fallback }}>
      <Feed />
    </SWRConfig>
  );
}

export async function getStaticProps() {
  const proposals = await subgraphService.getOpenProposals('desc', 10, 0);
  const votes = await subgraphService.getVotes('desc', 25, 0);

  return {
    props: {
      initialProposals: proposals,
      initialVotes: votes,
      fallback: {
        '/api/proposals': proposals,
        '/api/votes': votes,
      },
    },
    revalidate: 30,
  };
}
