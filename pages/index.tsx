import React, { useState } from 'react';
import { ProposalContainer } from '../components/ProposalsContainer';
import { SelectedProposalVoteView } from '../compositions/SelectedProposalVoteView';
import { Proposal, subgraphService } from '../lib/services/subgraph.service';
import { SWRConfig } from 'swr';
import { getKey, PaginatedVoteList } from '../compositions/PaginatedVoteList';
import { FallbackProp } from '../lib/util/swr';
import { viem } from '../lib/wagmi';
import { unstable_serialize } from 'swr/infinite';

type HomePageProps = {
  fallback: FallbackProp;
  openProposals: Proposal[];
};

export default function Home({ openProposals, fallback }: HomePageProps) {
  const [propososals, setProposals] = useState<Proposal[]>(openProposals);
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(
    null
  );

  const toggleProposalType = async (type: 'active' | 'all') => {
    let proposals;
    if (type == 'active') {
      const block = 0
  proposals = await subgraphService.getOpenProposals(
    block.toString(),
    'desc',
    10,
    0
  );

    } else {
      const block = await viem.getBlockNumber();
  proposals = await subgraphService.getOpenProposals(
    block.toString(),
    'asc',
    10,
    0
  );
  setProposals(proposals);
    }
  }

  return (
    <SWRConfig value={{ fallback }}>
      <div className="md:flex bg-gray-900 min-h-screen text-white font-sans">
        <div className="">
          <ProposalContainer
            proposals={propososals}
            selectedProposal={selectedProposal}
            setSelectedProposal={setSelectedProposal}
          />
        </div>
        <div>
        <h1 className="text-3xl font-semibold  m-4 px-2 pt-2">
            {selectedProposal ? `${selectedProposal.id}: ${selectedProposal.title}` : 'Vote Timeline'}
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
        </div>
      </div>
    </SWRConfig>
  );
}

export async function getStaticProps() {
  // TODO - update service with sensible defaults for use cross app
  const votes = await subgraphService.getVotes('desc', 10, 0);
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
