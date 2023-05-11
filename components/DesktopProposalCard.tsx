import { Proposal } from '../lib/services/subgraph.service';

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
  return (
    <div
  key={proposal.id}
  className={`flex flex-row items-center p-3 cursor-pointer border-tiny border-gray-700 ${selectedProposal && selectedProposal.id === proposal.id ? 'bg-gray-600' : 'bg-gray-800'}`}
  onClick={() => {
    if (selectedProposal && selectedProposal.id === proposal.id) {
      setSelectedProposal(null);
    } else {
      setSelectedProposal(proposal);
    }
  }}
>
  <div
    className={`flex items-center justify-center  w-12 h-12 `}
  >
    <h3 className="text-xl font-semibold text-white">{proposal.id}</h3>
  </div>
  <div className="ml-3">
    <p className=" text-gray-400 line-clamp-2">{proposal.title}</p>
    <div className="flex justify-between mt-1 text-xs w-32">
      <p className="text-green-400">
        <span className="">{proposal.forVotes} FOR</span>
      </p>
      <p className="text-red-400">
        <span className="">{proposal.againstVotes} AGAINST</span>
      </p>
    </div>
  </div>
</div>

  );
};
