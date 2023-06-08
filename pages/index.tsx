import React, { useState } from 'react';
import { ProposalContainer } from '../components/ProposalsContainer';
import { SelectedProposalVoteView } from '../compositions/SelectedProposalVoteView';
import { getKey, PaginatedVoteList } from '../compositions/PaginatedVoteList';
import { FallbackProp } from '../lib/util/swr';
import { viem } from '../lib/wagmi';
import { unstable_serialize } from 'swr/infinite';
import { Proposal, ProposalStatus } from '../types/Proposal';
import axios from 'axios';
import { getActiveProposals } from '../lib/proposals';
import { getNounsLink } from '../lib/util/link';
import { Page } from '../components/Page';
import StatsCard, { WeeklyStats } from '../components/StatsCard';
import { weeklyStats } from '../lib/stats';
import { getVotes, getVotesForProposal } from '../lib/votes';

type HomePageProps = {
  fallback: FallbackProp;
  openProposals: Proposal[];
  stats: WeeklyStats;
};

export default function Home({
  openProposals,
  fallback,
  stats,
}: HomePageProps) {
  const [propososals, setProposals] = useState<Proposal[]>(openProposals);
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(
    null
  );

  const toggleProposalsType = async (type: 'active' | 'all') => {
    let proposals;
    if (type == 'active') {
      const block = await viem.getBlockNumber();
      proposals = await axios.get('/api/proposals', {
        params: {
          currentBlock: block.toString(),
          startBlockLimit: (block + BigInt(100000)).toString(),
          endBlockLimit: block.toString(),
          order: 'asc',
          limit: 10,
          offset: 0,
        },
      });
      proposals = proposals.data.filter(
        proposal => proposal.status != ProposalStatus.Cancelled
      );
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
      proposals = proposals.data;
    }
    setProposals(proposals);
  };

  return (
    <Page title="Home" fallback={fallback}>
      <div className="md:flex bg-gray-900 min-h-screen text-white font-sans">
        <div className="md:fixed md:bottom-0 md:top-20 md:w-1/3 ">
          <ProposalContainer
            proposals={propososals}
            selectedProposal={selectedProposal}
            setSelectedProposal={setSelectedProposal}
            toggleProposalsType={toggleProposalsType}
          />
        </div>
        <div className="flex md:w-2/3 md:ml-auto relative">
          <div className={selectedProposal ? '' : 'md:w-2/3'}>
            <h1 className="text-3xl font-semibold  m-4 px-2 pt-2">
              {selectedProposal ? (
                <a
                  href={getNounsLink(selectedProposal.id)}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:underline"
                >
                  {selectedProposal.id}: {selectedProposal.title}
                </a>
              ) : (
                'Vote Timeline'
              )}
            </h1>
            <div className="flex flex-wrap justify-left m-4">
              {selectedProposal ? (
                <SelectedProposalVoteView selectedProposal={selectedProposal} />
              ) : (
                <div>
                  <PaginatedVoteList />
                </div>
              )}
            </div>
          </div>
          {!selectedProposal && (
            <div className="hidden md:block fixed right-0 top-20">
              <StatsCard stats={stats} />
            </div>
          )}
        </div>
      </div>
    </Page>
  );
}

export async function getStaticProps() {
  const votes = await getVotes({
    order: 'desc',
    limit: 10,
    offset: 0,
  });
  const block = await viem.getBlockNumber();
  let proposals = await getActiveProposals(block);

  proposals = proposals.filter(
    proposal => proposal.status != ProposalStatus.Cancelled
  );

  const prefetchedVotes = await Promise.all(
    proposals.slice(0, 3).map(p => getVotesForProposal(p.id, 'desc'))
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
      stats: await weeklyStats(),
    },
    revalidate: 10,
  };
}
