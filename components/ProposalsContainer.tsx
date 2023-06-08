import { useState, useEffect } from 'react';
import { ProposalCard } from './ProposalCard';
import React from 'react';

export function ProposalContainer({
  proposals,
  selectedProposal,
  setSelectedProposal,
  toggleProposalsType,
}) {
  // 1. Initialize state
  const [scrollDivHeight, setScrollDivHeight] = useState(0);

  // 2. Set up effect to update height on mount and on window resize
  useEffect(() => {
    const updateHeight = () => {
      const divElement = document.getElementById('scroll-div');
      if (divElement) {
        setScrollDivHeight(window.innerHeight - divElement.offsetTop);
      }
    };

    // Initial update
    updateHeight();

    // Add event listener
    window.addEventListener('resize', updateHeight);

    // Cleanup
    return () => {
      window.removeEventListener('resize', updateHeight);
    };
  }, []);

  const { width } = useWindowSize();
  const isMobile = width <= 768;

  const [selectedSegment, setSelectedSegment] = useState('active');

  return (
    <div className="md:ml-5 mt-4 flex flex-col ">
      <div className="bg-gray-800 p-2 md:mb-2  rounded-lg shadow-md ">
        <div className="flex">
          <button
            onClick={() => {
              toggleProposalsType('active');
              setSelectedSegment('active');
            }}
            className={`flex-1 py-2 px-4 rounded-lg ${
              selectedSegment === 'active'
                ? 'bg-gray-200 text-gray-800'
                : 'bg-gray-800 text-white'
            }`}
          >
            Active Proposals
          </button>
          <button
            onClick={() => {
              toggleProposalsType('all');
              setSelectedSegment('all');
            }}
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
      <div
        id="scroll-div"
        style={{ height: isMobile ? 'auto' : `${scrollDivHeight - 80}px` }}
        className="py-1 md:py-0 bg-gray-700 md:bg-gray-800 flex flex-row md:flex-col overflow-y-auto  hide-scrollbar"
      >
        {proposals.map((proposal, i) => (
          <div key={i}>
            <ProposalCard
              proposal={proposal}
              selectedProposal={selectedProposal}
              setSelectedProposal={setSelectedProposal}
              key={proposal.id}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    window.addEventListener('resize', handleResize);

    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
}
