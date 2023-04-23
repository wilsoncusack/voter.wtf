import type { NextPage } from 'next';
import React, { useEffect, useState, useRef, useCallback } from 'react';
import VoteReasons from '../components/VoteReasons';
import { WagmiConfig, createClient, configureChains, mainnet } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';

const { provider, webSocketProvider } = configureChains(
  [mainnet],
  [publicProvider()]
);

const client = createClient({
  autoConnect: true,
  provider,
  webSocketProvider,
});

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
  const observer = useRef<IntersectionObserver | null>(null);

  const fetchVotes = async (skip = 0) => {
    setLoading(true);
    const res = await fetch(`/api/getVotes?skip=${skip}`);
    const data = await res.json();
    setLoading(false);

    return data;
  };

  useEffect(() => {
    (async () => {
      const initialVotes = await fetchVotes();
      setVotes(initialVotes);
    })();
  }, []);

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
    <WagmiConfig client={client}>
      <div className="bg-black min-h-screen text-white font-mono">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold mb-6 text-gray-200">
            Nouns Vote with Reason
          </h1>
          <div className="space-y-6">
            {votes.map(vote => {
              return (
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
              );
            })}
            <div ref={lastVoteElementRef} className="h-4" />
          </div>
        </div>
      </div>
    </WagmiConfig>
  );
};

export default Home;
