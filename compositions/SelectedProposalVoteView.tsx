import {
  MobileForAgainstToggle,
  VoteType,
} from '../components/MobileForAgainstToggle';
import { VoteList } from '../components/VoteList';
import { useVotesForProposal } from '../hooks/useVotesForProposal';
import { clsx as classNames } from 'clsx';
import { useState } from 'react';
import { Proposal } from '../types/Proposal';

interface SelectedProposalVoteViewProps {
  selectedProposal: Proposal;
}

export function SelectedProposalVoteView({
  selectedProposal,
}: SelectedProposalVoteViewProps) {
  const [voteType, setVoteType] = useState<VoteType>('for');
  const { forVotes = [], againstVotes = [] } = useVotesForProposal(
    selectedProposal.id
  );

  if (!forVotes || !againstVotes) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <MobileForAgainstToggle
        setMobileVoteType={setVoteType}
        mobileVoteType={voteType}
      />
      <div className="w-full grid gap-4 px-4 md:grid-cols-2 sm:grid-cols-1">
        <div
          className={classNames([
            'md:block relative',
            voteType === 'for' ? 'block' : 'hidden',
          ])}
        >
          <h2 className="md:block absolute top-0 left-0 text-white text-xl mb-4 font-bold uppercase z-10">
            <span className="text-green-400">For</span>
          </h2>
          <div className="md:overflow-y-auto h-[80vh] mt-8 hide-scrollbar">
            <VoteList votes={forVotes} />
          </div>
        </div>
        <div
          className={classNames([
            'md:block relative',
            voteType === 'against' ? 'block' : 'hidden',
          ])}
        >
          <h2 className="md:block absolute top-0 left-0 text-white text-xl mb-4 font-bold uppercase z-10">
            <span className="text-red-400">Against</span>
          </h2>
          <div className="md:overflow-y-auto h-[80vh] mt-8 hide-scrollbar">
            <VoteList votes={againstVotes} />
          </div>
        </div>
      </div>
    </>
  );
}
