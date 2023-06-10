import { VoteList } from '../components/VoteList';
import { useVotesForProposal } from '../hooks/useVotesForProposal';
import { useState } from 'react';
import { Proposal } from '../types/Proposal';
import { ForAgainstView } from '../components/ForAgainstView';
import { ClockIcon, TableCellsIcon } from '@heroicons/react/24/outline';
import React from 'react';

interface SelectedProposalVoteViewProps {
  selectedProposal: Proposal;
}

export function SelectedProposalVoteView({
  selectedProposal,
}: SelectedProposalVoteViewProps) {
  const { votes } = useVotesForProposal(selectedProposal.id);
  const [timelineView, setTimelineView] = useState(false);

  if (!votes) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="flex mb-2">
        <button
          className={`rounded-md p-2 m-1 ${timelineView ? 'bg-gray-700 ' : ''}`}
          onClick={() => setTimelineView(true)}
        >
          <ClockIcon height={25} width={25} />
        </button>
        <button
          className={`rounded-md p-2 m-1 ${
            !timelineView ? 'bg-gray-700 ' : ''
          }`}
          onClick={() => setTimelineView(false)}
        >
          <TableCellsIcon height={25} width={25} />
        </button>
      </div>
      {timelineView ? (
        <VoteList votes={votes} />
      ) : (
        <ForAgainstView votes={votes} />
      )}
    </div>
  );
}
