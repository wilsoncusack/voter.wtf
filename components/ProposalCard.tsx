import { Proposal } from '../lib/services/subgraph.service';

interface ProposalCardProps {
  proposal: Proposal;
  selectedProposal: Proposal | null;
  setSelectedProposal: (proposal: Proposal | null) => void;
}

export const ProposalCard: React.FC<ProposalCardProps> = ({
  proposal,
  selectedProposal,
  setSelectedProposal,
}) => {
  return (
    <div
      key={proposal.id}
      className={`proposal-card p-3 min-w-max rounded-md shadow-lg cursor-pointer ${
        selectedProposal && selectedProposal.id === proposal.id
          ? 'bg-gray-600 '
          : 'bg-gray-800'
      }`}
      onClick={() => {
        if (selectedProposal && selectedProposal.id === proposal.id) {
          setSelectedProposal(null);
        } else {
          setSelectedProposal(proposal);
        }
      }}
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
