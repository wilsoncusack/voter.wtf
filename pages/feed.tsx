import { SWRConfig } from 'swr';
import { Feed } from '../compositions/Feed';
import { Proposal } from './index';
import { FallbackProp } from '../lib/util/swr';
import { subgraphService } from '../lib/services/subgraph.service';

type FeedPageProps = {
  fallback: FallbackProp;
  proposals: Proposal[];
};

export default function FeedPage({ fallback, proposals }: FeedPageProps) {
  return (
    <SWRConfig value={{ fallback }}>
      <Feed initialProposals={proposals} />
    </SWRConfig>
  );
}

export async function getStaticProps() {
  const proposals = await subgraphService.getOpenProposals('desc', 10, 0);
  const votes = await subgraphService.getVotes('desc', 25, 0);

  return {
    props: {
      proposals,
      fallback: {
        '/api/proposals': proposals,
        '/api/votes': votes,
      },
    },
    revalidate: 30,
  };
}
