import { useState } from 'react';
import { MobileProposalCard } from './MobileProposalCard';
import { DesktopProposalCard } from './DesktopProposalCard';

export function ProposalSegmentedControl({
  proposals,
  selectedProposal,
  setSelectedProposal,
}) {
  const [selectedSegment, setSelectedSegment] = useState('active');

  const renderProposals = () => {
    if (selectedSegment === 'active') {
      // Render active proposals
    } else {
      // Render all proposals
    }
  };

  return (
    <div className="md:ml-5 mt-4 flex flex-col w-full md:w-96">
      <div className="bg-gray-800 p-2 md:mb-2  rounded-lg shadow-md">
        <div className="flex">
          <button
            onClick={() => setSelectedSegment('active')}
            className={`flex-1 py-2 px-4 rounded-lg ${
              selectedSegment === 'active'
                ? 'bg-gray-200 text-gray-800'
                : 'bg-gray-800 text-white'
            }`}
          >
            Active Proposals
          </button>
          <button
            onClick={() => setSelectedSegment('all')}
            className={`flex-1 py-2 px-4 rounded-lg ${
              selectedSegment === 'all'
                ? 'bg-gray-200 text-gray-800'
                : 'bg-gray-800 text-white'
            }`}
          >
            All Proposals
          </button>
        </div>
      </div>
      <div className="py-4 md:py-0 bg-gray-700 md:bg-gray-800 flex flex-row md:flex-col overflow-y-hidden md:overflow-x-hidden">
        {proposals.map(proposal => (
          <div>
          <div className="md:hidden">
          <MobileProposalCard
            proposal={proposal}
            selectedProposal={selectedProposal}
            setSelectedProposal={setSelectedProposal}
            key={proposal.id}
          />
          </div>
          <div className="hidden md:block">
          <DesktopProposalCard
            proposal={proposal}
            selectedProposal={selectedProposal}
            setSelectedProposal={setSelectedProposal}
            key={proposal.id}
          />
          </div>
          </div>
        ))}
      </div>
    </div>
  );
}
