import type { NextPage } from 'next';
import React, { useEffect, useState } from 'react';
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

  useEffect(() => {
    fetchVotes();
  }, []);

  const fetchVotes = async () => {
    // Replace the URL below with the actual API URL for the Nouns subgraph.
    const res = await fetch('/api/getVotes');
    const data = await res.json();

    setVotes(data);
  };

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
          </div>
        </div>
      </div>
    </WagmiConfig>
  );
};

export default Home;
