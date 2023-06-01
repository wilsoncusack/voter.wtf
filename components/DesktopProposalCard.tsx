import { useBlockNumber } from 'wagmi';
import { Proposal, ProposalStatus } from '../types/Proposal';

interface DesktopProposalCardProps {
  proposal: Proposal;
  selectedProposal: Proposal | null;
  setSelectedProposal: (proposal: Proposal | null) => void;
}

export const DesktopProposalCard: React.FC<DesktopProposalCardProps> = ({
  proposal,
  selectedProposal,
  setSelectedProposal,
}) => {
  const { data: blockNumber } = useBlockNumber();
  return (
    <div
      className={`p-3 cursor-pointer border-tiny border-gray-700 ${
        selectedProposal && selectedProposal.id === proposal.id
          ? 'bg-gray-600'
          : 'bg-gray-800'
      }`}
    >
      <div
        key={proposal.id}
        className={`flex flex-row items-center`}
        onClick={() => {
          if (selectedProposal && selectedProposal.id === proposal.id) {
            setSelectedProposal(null);
          } else {
            setSelectedProposal(proposal);
          }
        }}
      >
        <div className={`flex flex-col items-center w-16 h-12 `}>
          <h3 className="text-xl font-semibold text-white">{proposal.id}</h3>
          <p
            className={`w-20 px-2 py-1 text-center font-bold rounded-full text-xs ${getStatusColor(
              proposal.status
            )}`}
          >
            {proposal.endBlock > blockNumber
              ? proposal.startBlock < blockNumber
                ? formatDuration((proposal.endBlock - blockNumber) * 12)
                : formatDuration((proposal.startBlock - blockNumber) * 12)
              : proposal.status}
          </p>
        </div>
        <div className="ml-3 w-full">
          <p className="text-gray-400 line-clamp-2">{proposal.title}</p>

          <div className="flex items-center justify-between mt-1 text-xs w-full">
            <p className="text-green-400">
              <span className="">{proposal.forVotes} FOR</span>
            </p>
            <p className="text-red-400">
              <span className="">{proposal.againstVotes} AGAINST</span>
            </p>
            <p className="text-gray-400">
              Threshold {Math.floor(proposal.dynamicQuorum)}
            </p>
          </div>
        </div>
      </div>
      <div className="flex mt-2"></div>
    </div>
  );
};

function formatDuration(duration) {
  let remaining = Math.abs(duration);

  const days = Math.floor(remaining / (60 * 60 * 24));
  remaining %= 60 * 60 * 24;

  const hours = Math.floor(remaining / (60 * 60));
  remaining %= 60 * 60;

  const minutes = Math.floor(remaining / 60);
  remaining %= 60;

  const seconds = remaining;

  const result = '';

  if (days > 0) {
    return `${days} day${days > 1 ? 's' : ''} `;
  }
  if (hours > 0) {
    return `${hours} hour${hours > 1 ? 's' : ''} `;
  }
  if (minutes > 0) {
    return `${minutes} minute${minutes > 1 ? 's' : ''} `;
  }
  if (seconds > 0) {
    return `${seconds} second${seconds > 1 ? 's' : ''}`;
  }

  return result.trim();
}

function getStatusColor(status: ProposalStatus) {
  switch (status) {
    case ProposalStatus.Voting:
      return 'text-green-400';
    case ProposalStatus.Succeeded:
      return 'text-green-600';
    case ProposalStatus.Defeated:
      return 'text-red-500';
    default:
      return 'text-gray-500';
  }
}
