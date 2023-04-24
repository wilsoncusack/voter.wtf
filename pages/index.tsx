import type { NextPage } from 'next';
import React, { useEffect, useState, useRef, useCallback } from 'react';
import VoteReasons from '../components/VoteReasons';
import { useBlockNumber } from 'wagmi';

interface Vote {
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

const Home: NextPage = () => {
  const [votes, setVotes] = useState<Vote[]>([]);
  const [skip, setSkip] = useState(0);
  const [loading, setLoading] = useState(false);
  const [openProposals, setOpenProposals] = useState([]);
  const [selectedProposal, setSelectedProposal] = useState(null);
  const [forVotes, setForVotes] = useState([]);
  const [againstVotes, setAgainstVotes] = useState([]);
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

    const res = await fetch(`/api/getOpenProposals?endBlock=${0}`);
    const data = await res.json();

    setOpenProposals(data);
  }, [block]);

  const fetchProposalVotes = async (proposalId: string) => {
    const res = await fetch(`/api/getProposalVotes?proposalId=${proposalId}`);
    const data = await res.json();

    return data;
  };

  const loadProposalVotes = async proposal => {
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
      await fetchOpenProposals();
    })();
  }, [fetchOpenProposals]);

  const fetchMoreVotes = useCallback(async () => {
    const newVotes = await fetchVotes(skip + 20);
    console.log(newVotes);
    setVotes(prevVotes => {
      console.log(prevVotes);
      return [...prevVotes, ...newVotes];
    });
    setSkip(prevSkip => prevSkip + 20);
  }, [skip]);

  const lastVoteElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) {
          fetchMoreVotes();
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, fetchMoreVotes]
  );

  return (
    <div className="bg-gray-900 min-h-screen text-white font-sans">
      <header className="text-center py-6">
        <h1 className="text-4xl font-bold">Nouns Vote with Reason</h1>
      </header>
      <div className=" ">
        <h2 className="text-xl font-semibold  mb-4 px-4">Proposals</h2>
        <div className="flex space-x-4 py-4 px-4  hide-scrollbar min-h-36 overflow-x-scroll overflow-y-hidden ">
          {openProposals.map(proposal => (
            <div
              key={proposal.id}
              className={`proposal-card p-3 w-80 rounded-md shadow-lg cursor-pointer ${
                selectedProposal && selectedProposal.id === proposal.id
                  ? 'bg-gray-600 '
                  : 'bg-gray-800'
              }`}
              onClick={() => {
                if (selectedProposal && selectedProposal.id === proposal.id) {
                  setSelectedProposal(null);
                } else {
                  setSelectedProposal(proposal);
                  loadProposalVotes(proposal);
                }
              }}
            >
              <p className="text-sm text-gray-400">{proposal.id}</p>
              <h3 className="text-lg font-semibold">{proposal.title}</h3>
              <p className="text-sm text-green-400 ">
                FOR <span className="font-semibold">{proposal.forVotes} </span>
              </p>
              <p className="text-sm text-red-400">
                AGAINST{' '}
                <span className="font-semibold">{proposal.againstVotes} </span>
              </p>
              <p className="text-xs">
                {/* Voting Ends: {formatDistanceToNowStrict(new Date(proposal.endTime * 1000))} Remaining */}
              </p>
            </div>
          ))}
        </div>
      </div>

      <h2 className="text-xl  font-semibold  m-4 px-2 pt-2">Votes</h2>
      <div className="flex flex-wrap justify-center m-4">
        {selectedProposal ? (
          <>
            {selectedProposal && (
              <div className="w-full md:hidden flex justify-center my-4">
                <button
                  className={`bg-gray-700 text-white px-4 py-2 rounded-l-md focus:outline-none ${
                    mobileVoteType === 'for' ? 'bg-gray-800' : ''
                  }`}
                  onClick={() => setMobileVoteType('for')}
                >
                  For
                </button>
                <button
                  className={`bg-gray-700 text-white px-4 py-2 rounded-r-md focus:outline-none ${
                    mobileVoteType === 'against' ? 'bg-gray-800' : ''
                  }`}
                  onClick={() => setMobileVoteType('against')}
                >
                  Against
                </button>
              </div>
            )}
            <div
              className={`w-full ${selectedProposal && 'md:hidden'} ${
                mobileVoteType === 'for' ? 'block' : 'hidden'
              }`}
            >
              {forVotes.map(vote => (
                <VoteReasons
                  key={vote.id}
                  votes={vote.votes}
                  address={vote.voter.id}
                  isFor={vote.supportDetailed}
                  reason={vote.reason}
                  block={vote.blockNumber}
                  proposalTitle={vote.proposal.title}
                  proposalId={vote.proposal.id}
                />
              ))}
            </div>
            <div
              className={`w-full ${selectedProposal && 'md:hidden'} ${
                mobileVoteType === 'against' ? 'block' : 'hidden'
              }`}
            >
              {againstVotes.map(vote => (
                <VoteReasons
                  key={vote.id}
                  votes={vote.votes}
                  address={vote.voter.id}
                  isFor={vote.supportDetailed}
                  reason={vote.reason}
                  block={vote.blockNumber}
                  proposalTitle={vote.proposal.title}
                  proposalId={vote.proposal.id}
                />
              ))}
            </div>
            <div className="for-column m-4 flex-1">
              <h2 className="text-white text-xl mb-4 font-bold">
                <span className="text-green-400">FOR</span>
              </h2>
              {forVotes.map(vote => (
                <VoteReasons
                  key={vote.id}
                  votes={vote.votes}
                  address={vote.voter.id}
                  isFor={vote.supportDetailed}
                  reason={vote.reason}
                  block={vote.blockNumber}
                  proposalTitle={vote.proposal.title}
                  proposalId={vote.proposal.id}
                />
              ))}
            </div>
            <div className="for-column m-4 flex-1">
              <h2 className="text-white text-xl mb-4 font-bold">
                <span className="text-red-400">AGAINST</span>
              </h2>
              {againstVotes.map(vote => (
                <VoteReasons
                  key={vote.id}
                  votes={vote.votes}
                  address={vote.voter.id}
                  isFor={vote.supportDetailed}
                  reason={vote.reason}
                  block={vote.blockNumber}
                  proposalTitle={vote.proposal.title}
                  proposalId={vote.proposal.id}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="w-full">
            {votes.map(vote => (
              <VoteReasons
                key={vote.id}
                votes={vote.votes}
                address={vote.voter.id}
                isFor={vote.supportDetailed}
                reason={vote.reason}
                block={vote.blockNumber}
                proposalTitle={vote.proposal.title}
                proposalId={vote.proposal.id}
              />
            ))}
            <div ref={lastVoteElementRef} className="h-4" />
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
