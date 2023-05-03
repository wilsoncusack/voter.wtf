import React, { useState } from 'react';
import { ProposalContainer } from '../components/ProposalsContainer';
import { SelectedProposalVoteView } from '../compositions/SelectedProposalVoteView';
import { Proposal, subgraphService } from '../lib/services/subgraph.service';
import { getKey, PaginatedVoteList } from '../compositions/PaginatedVoteList';
import { FallbackProp } from '../lib/util/swr';
import { viem } from '../lib/wagmi';
import { unstable_serialize } from 'swr/infinite';
import { Page } from '../components/Page';

type HomePageProps = {
  fallback: FallbackProp;
  openProposals: Proposal[];
};

export default function Home({ openProposals, fallback }: HomePageProps) {
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(
    null
  );

  return (
    <Page title="Home" fallback={fallback}>
      <section>
        <div>
          <h1 className="text-3xl font-semibold  mb-4 px-4">
            Active Proposals
          </h1>
          <ProposalContainer
            proposals={openProposals}
            selectedProposal={selectedProposal}
            setSelectedProposal={setSelectedProposal}
          />
        </div>
        <h1 className="text-3xl font-semibold  m-4 px-2 pt-2">
          {selectedProposal ? selectedProposal.title : 'All'} Votes
        </h1>
        <div className="flex flex-wrap justify-center m-4">
          {selectedProposal ? (
            <SelectedProposalVoteView selectedProposal={selectedProposal} />
          ) : (
            <div className="flex justify-center items-center">
              <PaginatedVoteList />
            </div>
          )}
        </div>
      </section>
    </Page>
  );
}

export async function getStaticProps() {
  // TODO - update service with sensible defaults for use cross app
  const votes = await subgraphService.getVotes({
    order: 'desc',
    limit: 5,
    offset: 0,
  });
  const block = await viem.getBlockNumber();
  const proposals = await subgraphService.getOpenProposals(
    block.toString(),
    'asc',
    10,
    0
  );

  const prefetchedVotes = await Promise.all(
    proposals.map(p => subgraphService.getVotesForProposal(p.id, 'desc'))
  );

  const voteFallback = prefetchedVotes.reduce((acc, votes, idx) => {
    const key = proposals[idx].id;
    return {
      ...acc,
      [`/api/proposals/${key}/votes`]: votes,
    };
  }, {});

  return {
    props: {
      openProposals: proposals,
      fallback: {
        [unstable_serialize(getKey)]: votes,
        ...voteFallback,
      },
    },
    revalidate: 10,
  };
}
