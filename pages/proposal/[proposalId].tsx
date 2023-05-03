import React from 'react';
import { VoteList } from '../../components/VoteList';
import { Proposal, subgraphService } from '../../lib/services/subgraph.service';
import { SWRConfig } from 'swr';
import { clsx as classNames } from 'clsx';
import { buildVotesWithLikes } from '../../lib';

type HomePageProps = {
  proposal: Proposal;
};

const StaticProposalCard = ({ proposal }) => {
  return (
    <div
      key={proposal.id}
      className={`proposal-card p-3 min-w-max rounded-md shadow-lg bg-gray-600`}
    >
      <p className="text-sm text-gray-400">{proposal.id}</p>
      <h3 className="text-lg font-semibold">{proposal.title}</h3>
      <p className="text-sm text-green-400 ">
        <span className="">{proposal.forVotes}</span> FOR
      </p>
      <p className="text-sm text-red-400 ">
        <span className="">{proposal.againstVotes}</span> AGAINST
      </p>
      <p className="text-xs">
        {/* Voting Ends: {formatDistanceToNowStrict(new Date(proposals.endTime * 1000))} Remaining */}
      </p>
    </div>
  );
};

export default function ProposalIdPage({ proposal }: HomePageProps) {
  const forVotes = proposal.votes.filter(vote => vote.support);
  const againstVotes = proposal.votes.filter(vote => !vote.support);

  return (
    <SWRConfig>
      <div className="bg-gray-900 min-h-screen text-white font-sans">
        <header className="text-center">
          <div className="flex flex-col md:flex-row justify-center items-center">
            <img
              src="../noun652head.svg"
              alt="Noun652 Head"
              className="w-auto h-32 md:order-2"
            />
            <h1 className="neon mb-4 md:mb-0 md:order-1">Vote with Reason</h1>
          </div>
        </header>
        <div className="px-6">
          <div className="max-w-[200px]">
            <StaticProposalCard proposal={proposal} />
          </div>
        </div>
        <h1 className="text-3xl font-semibold  m-4 px-2 pt-2">Votes</h1>
        <div className="w-full grid gap-4 px-4 md:grid-cols-2 sm:grid-cols-1">
          <div className={classNames(['md:block'])}>
            <h2 className="md:block hidden text-white text-xl mb-4 font-bold uppercase">
              <span className="text-green-400">For</span>
            </h2>
            <VoteList votes={forVotes} />
          </div>
          <div className={classNames(['md:block'])}>
            <h2 className="md:block hidden text-white text-xl mb-4 font-bold uppercase">
              <span className="text-red-400">Against</span>
            </h2>
            <VoteList votes={againstVotes} />
          </div>
        </div>
      </div>
    </SWRConfig>
  );
}

export async function getServerSideProps(context) {
  const { proposalId } = context.query;
  const proposal = await subgraphService.getProposalById(proposalId);
  const votesWithLikes = await buildVotesWithLikes(proposal.votes);
  proposal.votes = votesWithLikes;

  return {
    props: {
      proposal: proposal,
    },
  };
}
