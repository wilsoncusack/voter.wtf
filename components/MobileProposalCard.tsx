import { Proposal } from "../types/Proposal";

interface MobileProposalCardProps {
  proposal: Proposal;
  selectedProposal: Proposal | null;
  setSelectedProposal: (proposal: Proposal | null) => void;
}

export const MobileProposalCard: React.FC<MobileProposalCardProps> = ({
  proposal,
  selectedProposal,
  setSelectedProposal,
}) => {
  return (
    <div
      key={proposal.id}
      className="mx-2 flex flex-col items-center"
      onClick={() => {
        if (selectedProposal && selectedProposal.id === proposal.id) {
          setSelectedProposal(null);
        } else {
          setSelectedProposal(proposal);
        }
      }}
    >
      <div
        className={`flex flex-col items-center  justify-center min-w-max rounded-full w-20 h-20 shadow-lg cursor-pointer ${
          selectedProposal && selectedProposal.id === proposal.id
            ? 'bg-gray-600'
            : 'bg-gray-800'
        }`}
      >
        <h3 className="text-xl font-semibold">{proposal.id}</h3>
      </div>
      <p className="text-xs text-gray-400 mt-2  w-32 line-clamp-2 text-center">
        {proposal.title}
      </p>

      <div className="flex justify-between mt-1 text-xs space-x-1">
        <p className="text-green-400 ">
          <span className="">{proposal.forVotes} </span>
        </p>
        <p className="text-red-400">
          <span className="">{proposal.againstVotes}</span>
        </p>
      </div>
    </div>
  );
};
