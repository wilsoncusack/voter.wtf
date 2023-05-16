import React, { useState } from 'react';
import { ProposalContainer } from '../components/ProposalsContainer';
import { SelectedProposalVoteView } from '../compositions/SelectedProposalVoteView';
import { subgraphService } from '../lib/services/subgraph.service';
import { SWRConfig } from 'swr';
import { getKey, PaginatedVoteList } from '../compositions/PaginatedVoteList';
import { FallbackProp } from '../lib/util/swr';
import { viem } from '../lib/wagmi';
import { unstable_serialize } from 'swr/infinite';
import { Proposal } from '../types/Proposal';
import axios from 'axios';
import { getProposals } from '../lib/proposals';

type HomePageProps = {
  fallback: FallbackProp;
  openProposals: Proposal[];
};

export default function Home({ openProposals, fallback }: HomePageProps) {
  const [propososals, setProposals] = useState<Proposal[]>(openProposals);
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(
    null
  );

  const toggleProposalsType = async (type: 'active' | 'all') => {
    console.log(type);
    let proposals;
    if (type == 'active') {
      const block = await viem.getBlockNumber();
      proposals = await axios.get('/api/proposals', {
        params: {
          currentBlock: block.toString(),
          startBlockLimit: block.toString(),
          endBlockLimit: block.toString(),
          order: 'asc',
          limit: 10,
          offset: 0,
        },
      });
    } else {
      const block = await viem.getBlockNumber();
      proposals = await axios.get('/api/proposals', {
        params: {
          currentBlock: block.toString(),
          startBlockLimit: (block + BigInt(100000)).toString(),
          endBlockLimit: 0,
          order: 'desc',
          limit: 400,
          offset: 0,
        },
      });
      console.log(proposals);
    }
    setProposals(proposals.data);
  };

  return (
    <SWRConfig value={{ fallback }}>
      <div className="md:flex bg-gray-900 min-h-screen text-white font-sans">
        <div className="md:fixed md:overflow-y-auto md:w-1/3 md:max-h-screen">
          <ProposalContainer
            proposals={propososals}
            selectedProposal={selectedProposal}
            setSelectedProposal={setSelectedProposal}
            toggleProposalsType={toggleProposalsType}
          />
        </div>
        <div className="md:w-2/3 md:ml-auto">
          <h1 className="text-3xl font-semibold  m-4 px-2 pt-2">
            {selectedProposal ? (
              <a
                href={`https://nouns.wtf/vote/${selectedProposal.id}`}
                target="_blank"
              >
                {selectedProposal.id}: ${selectedProposal.title}
              </a>
            ) : (
              'Vote Timeline'
            )}
          </h1>
          <div className="flex flex-wrap justify-left m-4">
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
  const proposals = await getProposals(
    block,
    block.toString(),
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
