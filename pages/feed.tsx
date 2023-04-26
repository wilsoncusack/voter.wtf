import { SWRConfig } from 'swr';
import { Feed } from '../compositions/Feed';
import { FallbackProp } from '../lib/util/swr';
import { subgraphService, Vote } from '../lib/services/subgraph.service';

type FeedPageProps = {
  fallback: FallbackProp;
  initialVotes: Vote[];
};

export default function FeedPage({ fallback, initialVotes }: FeedPageProps) {
  return (
    <SWRConfig value={{ fallback }}>
      <Feed initialVotes={initialVotes} />
    </SWRConfig>
  );
}

export async function getStaticProps() {
  // TODO - update service with sensible defaults for use cross app
  const proposals = await subgraphService.getOpenProposals('desc', 10, 0);
  const votes = await subgraphService.getVotes('desc', 20, 0);

  return {
    props: {
      initialProposals: proposals,
      initialVotes: votes,
      fallback: {
        '/api/proposals': proposals,
        '/api/votes?page=1': votes,
      },
    },
    revalidate: 30,
  };
}
