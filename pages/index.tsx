import React, { useCallback, useState } from 'react';
import { ProposalContainer } from '../components/ProposalsContainer';
import { SelectedProposalVoteView } from '../components/SelectedProposalVoteView';
import {
  Proposal,
  subgraphService,
  Vote,
} from '../lib/services/subgraph.service';
import { SWRConfig } from 'swr';
import { getKey, PaginatedVoteList } from '../compositions/PaginatedVoteList';
import { FallbackProp } from '../lib/util/swr';
import { viem } from '../lib/wagmi';
import { VoteWithLikes } from '../lib/types/VoteWithLikes';
import { unstable_serialize } from 'swr/infinite';

type HomePageProps = {
  fallback: FallbackProp;
  openProposals: Proposal[];
};

export default function Home({ openProposals, fallback }: HomePageProps) {
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(
    null
  );
  const [forVotes, setForVotes] = useState<VoteWithLikes[]>([]);
  const [againstVotes, setAgainstVotes] = useState<VoteWithLikes[]>([]);
  const [mobileVoteType, setMobileVoteType] = useState<'for' | 'against'>(
    'for'
  );

  const fetchProposalVotes = async (proposalId: string) => {
    const res = await fetch(`/api/getProposalVotes?proposalId=${proposalId}`);
    const data = await res.json();

    return data;
  };

  const loadProposalVotes = useCallback(async proposal => {
    setSelectedProposal(proposal);

    if (proposal == null) return;

    const allVotes = await fetchProposalVotes(proposal.id);
    const forVotes = allVotes
      .filter((vote: VoteWithLikes) => vote.support === true)
      .sort(
        (a: VoteWithLikes, b: VoteWithLikes) =>
          b.nounHolderLikes.length +
          b.nonNounHolderLikes.length -
          (a.nounHolderLikes.length + a.nonNounHolderLikes.length)
      );
    const againstVotes = allVotes
      .filter((vote: Vote) => vote.support === false)
      .sort(
        (a: VoteWithLikes, b: VoteWithLikes) =>
          b.nounHolderLikes.length +
          b.nonNounHolderLikes.length -
          (a.nounHolderLikes.length + a.nonNounHolderLikes.length)
      );

    setForVotes(forVotes);
    setAgainstVotes(againstVotes);
  }, []);

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
              forVotes={forVotes}
              againstVotes={againstVotes}
            />
          ) : (
            <div className="flex justify-center items-center">
              <PaginatedVoteList />
            </div>
          )}
        </div>
      </div>
    </SWRConfig>
  );
}

export async function getStaticProps() {
  // TODO - update service with sensible defaults for use cross app
  const votes = await subgraphService.getVotes('desc', 5, 0);
  const block = await viem.getBlockNumber();
  const proposals = await subgraphService.getOpenProposals(
    block.toString(),
    'asc',
    10,
    0
  );

  return {
    props: {
      openProposals: proposals,
      fallback: {
        [unstable_serialize(getKey)]: votes,
      },
    },
    revalidate: 10,
  };
}
