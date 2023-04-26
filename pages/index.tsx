import type { NextPage } from 'next';
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { VoteList } from '../components/VoteList';
import { ProposalContainer } from '../components/ProposalsContainer';
import { SelectedProposalVoteView } from '../components/SelectedProposalVoteView';
import { useBlockNumber } from 'wagmi';

export interface Vote {
  id: string;
  vote: number;
  votes: number;
  support: boolean;
  supportDetailed: number;
  reason: string;
  voter: {
    id: string;
  };
  proposal: {
    id: string;
    title: string;
  };
  blockNumber: number;
}

export interface Proposal {
  id: string;
  title: string;
  description: string;
  startBlock: number;
  endBlock: number;
  forVotes: number;
  againstVotes: number;
  status: string;
}

const Home: NextPage = () => {
  const [votes, setVotes] = useState<Vote[]>([]);
  const [skip, setSkip] = useState(0);
  const [loading, setLoading] = useState(false);
  const [openProposals, setOpenProposals] = useState<Proposal[]>([]);
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(
    null
  );
  const [forVotes, setForVotes] = useState<Vote[]>([]);
  const [againstVotes, setAgainstVotes] = useState<Vote[]>([]);
  const [mobileVoteType, setMobileVoteType] = useState<'for' | 'against'>(
    'for'
  );

  const observer = useRef<IntersectionObserver | null>(null);
  const block = useBlockNumber({
    cacheTime: 2_000_000,
  });

  const fetchVotes = async (skip = 0) => {
    setLoading(true);
    const res = await fetch(`/api/getVotes?skip=${skip}`);
    const data = await res.json();
    setLoading(false);

    return data;
  };

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

  const loadProposalVotes = async proposal => {
    setSelectedProposal(proposal);

    if (proposal == null) return;

    const allVotes = await fetchProposalVotes(proposal.id);
    const forVotes = allVotes.filter((vote: Vote) => vote.support === true);
    const againstVotes = allVotes.filter(
      (vote: Vote) => vote.support === false
    );

    setForVotes(forVotes);
    setAgainstVotes(againstVotes);
  };

  useEffect(() => {
    (async () => {
      const initialVotes = await fetchVotes();
      setVotes(initialVotes);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      fetchOpenProposals();
    })();
  }, [block.data, fetchOpenProposals]);

  const fetchMoreVotes = useCallback(async () => {
    const newVotes = await fetchVotes(skip + 20);
    setVotes(prevVotes => {
      return [...prevVotes, ...newVotes];
    });
    setSkip(prevSkip => prevSkip + 20);
  }, [skip]);

  const lastVoteElementRef = useCallback(
    async (node: HTMLDivElement) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver(async entries => {
        if (entries[0].isIntersecting) {
          await fetchMoreVotes();
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, fetchMoreVotes]
  );

  return (
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
        <h1 className="text-3xl font-semibold  mb-4 px-4">Active Proposals</h1>
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
            <div>
              <VoteList votes={votes} />
            </div>
            <div ref={lastVoteElementRef} className="h-4" />
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
