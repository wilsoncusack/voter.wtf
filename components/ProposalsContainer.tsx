
import { Proposal } from '../types/Proposal';
import { ProposalSegmentedControl } from './ProposalSegmentedControl';

interface ProposalContainerProps {
  proposals: Proposal[];
  selectedProposal: Proposal | null;
  setSelectedProposal: (proposal: Proposal | null) => void;
}

export const ProposalContainer: React.FC<ProposalContainerProps> = ({
  proposals,
  selectedProposal,
  setSelectedProposal,
}) => {
  return (
    <ProposalSegmentedControl
      proposals={proposals}
      selectedProposal={selectedProposal}
      setSelectedProposal={setSelectedProposal}
    />
    // <div className="flex space-x-4 py-4 px-4  hide-scrollbar min-h-36 overflow-x-scroll overflow-y-hidden ">
    //   {proposals.map(proposal => (
    //     <ProposalCard
    //       key={proposal.id}
    //       proposal={proposal}
    //       selectedProposal={selectedProposal}
    //       setSelectedProposal={setSelectedProposal}
    //     />
    //   ))}
    // </div>
  );
};
