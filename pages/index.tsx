import React, { useCallback, useEffect, useState } from 'react';
import { ProposalContainer } from '../components/ProposalsContainer';
import { SelectedProposalVoteView } from '../compositions/SelectedProposalVoteView';
import { useBlockNumber } from 'wagmi';
import {
  Proposal,
  subgraphService,
  Vote,
} from '../lib/services/subgraph.service';
import { SWRConfig } from 'swr';
import { PaginatedVoteList } from '../compositions/PaginatedVoteList';
import { FallbackProp } from '../lib/util/swr';

type HomePageProps = {
  fallback: FallbackProp;
  initialVotes: Vote[];
};

export default function Home({ fallback, initialVotes }: HomePageProps) {
  const [openProposals, setOpenProposals] = useState<Proposal[]>([]);
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(
    null
  );
  const [forVotes, setForVotes] = useState<Vote[]>([]);
  const [againstVotes, setAgainstVotes] = useState<Vote[]>([]);
  const [mobileVoteType, setMobileVoteType] = useState<'for' | 'against'>(
    'for'
  );

  const block = useBlockNumber({
    cacheTime: 2_000_000,
  });

  const fetchOpenProposals = useCallback(async () => {
    if (block.data == undefined) return;

    const res = await fetch(`/api/getOpenProposals?block=${block.data}`);
    const data = await res.json();

    setOpenProposals(data);
  }, [block.data]);

  const fetchProposalVotes = async (proposalId: string) => {
    const res = await fetch(`/api/getProposalVotes?proposalId=${proposalId}`);
    const data = await res.json();

    return data;
  };

  const loadProposalVotes = useCallback(async proposal => {
    setSelectedProposal(proposal);

    if (proposal == null) return;

    const allVotes = await fetchProposalVotes(proposal.id);
    const forVotes = allVotes.filter((vote: Vote) => vote.support === true);
    const againstVotes = allVotes.filter(
      (vote: Vote) => vote.support === false
    );

    setForVotes(forVotes);
    setAgainstVotes(againstVotes);
  }, []);

  useEffect(() => {
    fetchOpenProposals().then();
  }, [block.data, fetchOpenProposals]);

  return (
    <SWRConfig value={{ fallback }}>
      <div className="bg-gray-900 min-h-screen text-white font-sans">
        <header className="text-center">
          <div className="flex flex-col md:flex-row justify-center items-center">
            <img
              src="noun652head.svg"
              alt="Noun652 Head"
              className="w-auto h-32 md:order-2"
            />
            <h1 className="neon mb-4 md:mb-0 md:order-1">Vote with Reason</h1>
          </div>
        </header>
        <div>
          <h1 className="text-3xl font-semibold  mb-4 px-4">
            Active Proposals
          </h1>
          <ProposalContainer
            proposals={openProposals}
            selectedProposal={selectedProposal}
            setSelectedProposal={loadProposalVotes}
          />
        </div>
        <h1 className="text-3xl font-semibold  m-4 px-2 pt-2">
          {selectedProposal ? selectedProposal.title : 'All'} Votes
        </h1>
        <div className="flex flex-wrap justify-center m-4">
          {selectedProposal ? (
            <SelectedProposalVoteView
              selectedProposal={selectedProposal}
              mobileVoteType={mobileVoteType}
              setMobileVoteType={setMobileVoteType}
            />
          ) : (
            <div className="flex justify-center items-center">
              <PaginatedVoteList initialVotes={initialVotes} />
            </div>
          )}
        </div>
      </div>
    </SWRConfig>
  );
}

export async function getStaticProps() {
  // TODO - update service with sensible defaults for use cross app
  const votes = await subgraphService.getVotes('desc', 10, 0);

  return {
    props: {
      initialVotes: votes,
      fallback: {
        '/api/votes?page=1': votes,
      },
    },
    revalidate: 30,
  };
}
