import React from 'react';
import useSWR from 'swr';
import VoteReasons from '../components/VoteReasons';

export function Feed() {
  const { data: proposals, error: proposalsError } = useSWR('/api/proposals');
  const { data: votes, error: votesError } = useSWR('/api/votes');

  if (!proposals || !votes) {
    return <div>Loading...</div>;
  }

  if (proposalsError || votesError) {
    return <div>Error fetching data</div>;
  }

  return (
    <div>
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
    </div>
  );
}
