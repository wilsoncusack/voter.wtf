import React from 'react';
import { Proposal } from '../types/Proposal';
import { formatDuration } from '../lib/util/format';
import { useBlockNumber, useAccount } from 'wagmi';
import { VotingStatusIndicator } from './VotingStatusIndicator';
import { getStatusColor } from '../lib/proposals';

interface MobileProposalCardProps {
  proposal: Proposal;
  selectedProposal: Proposal | null;
  setSelectedProposal: (proposal: Proposal | null) => void;
  ref: React.RefObject<HTMLDivElement>;
}

export const ProposalCard = React.forwardRef<
  HTMLDivElement,
  MobileProposalCardProps
>(({ proposal, selectedProposal, setSelectedProposal }, ref) => {
  const { address: account } = useAccount();
  // extract fields from proposal
  const { id, status, title, forVotes, againstVotes } = proposal;

  const { data: blockNumber } = useBlockNumber();
  return (
    <div
      ref={ref}
      key={proposal.id}
      onClick={() => {
        if (selectedProposal && selectedProposal.id === proposal.id) {
          setSelectedProposal(null);
        } else {
          setSelectedProposal(proposal);
        }
      }}
      className={`my-1 ml-2 p-4 w-52 rounded-lg md:w-full md:border-tiny md:m-0 md:rounded-none md:border-gray-700 ${
        selectedProposal && selectedProposal.id === proposal.id
          ? 'bg-gray-600'
          : 'bg-gray-800'
      }`}
    >
      <div>
        <div className="text-sm ">
          {blockNumber && proposal.endBlock > blockNumber ? (
            <div>
              {' '}
              {proposal.startBlock < blockNumber ? (
                <div className="flex justify-between">
                  <p className="text-gray-500">
                    ends in{' '}
                    {formatDuration(BigInt(proposal.endBlock), blockNumber)}
                  </p>
                  {account && (
                    <VotingStatusIndicator
                      proposalId={BigInt(id)}
                      address={account}
                    />
                  )}
                </div>
              ) : (
                <p className="text-gray-500">
                  starts in{' '}
                  {formatDuration(BigInt(proposal.startBlock), blockNumber)}
                </p>
              )}
            </div>
          ) : (
            <p className={` ${getStatusColor(proposal.status)}`}> {status} </p>
          )}
        </div>
      </div>

      <div className="mt-2 h-14 md:h-auto text-lg text-white line-clamp-2">
        {id}: {title}
      </div>
      <div className="mt-2 flex items-center">
        <div className="text-sm text-green-500">{forVotes}</div>
        <span className="text-gray-500 text-lg mx-1"> · </span>
        <div className="text-sm text-red-500">{againstVotes}</div>
        <span className="text-gray-500 text-lg mx-1"> · </span>
        <div className="text-sm text-gray-500">
          Threshold {proposal.quorumVotes}
        </div>
      </div>
    </div>
  );
});

ProposalCard.displayName = 'ProposalCard';
