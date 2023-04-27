import { MobileForAgainstToggle } from '../components/MobileForAgainstToggle';
import { VoteList } from '../components/VoteList';
import { Proposal, Vote } from '../lib/services/subgraph.service';
import { useVotesForProposal } from '../hooks/useVotesForProposal';

interface SelectedProposalVoteViewProps {
  setMobileVoteType: (type: 'for' | 'against') => void;
  mobileVoteType: 'for' | 'against';
  selectedProposal: Proposal | null;
  // forVotes: Vote[];
  // againstVotes: Vote[];
}

export function SelectedProposalVoteView({
  setMobileVoteType,
  mobileVoteType,
  selectedProposal,
}: SelectedProposalVoteViewProps) {
  const {
    forVotes = [],
    againstVotes = [],
    isLoading,
  } = useVotesForProposal(selectedProposal.id);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {selectedProposal && (
        <MobileForAgainstToggle
          setMobileVoteType={setMobileVoteType}
          mobileVoteType={mobileVoteType}
        />
      )}
      <div
        className={`w-full ${selectedProposal && 'md:hidden'} ${
          mobileVoteType === 'for' ? 'block' : 'hidden'
        }`}
      >
        <VoteList votes={forVotes} />
      </div>
      <div
        className={`w-full ${selectedProposal && 'md:hidden'} ${
          mobileVoteType === 'against' ? 'block' : 'hidden'
        }`}
      >
        <VoteList votes={againstVotes} />
      </div>
      <div className="for-column  m-4 flex-1">
        <h2 className="text-white text-xl mb-4 font-bold">
          <span className="text-green-400">FOR</span>
        </h2>
        <VoteList votes={forVotes} />
      </div>
      <div className="for-column m-4 flex-1">
        <h2 className="text-white text-xl mb-4 font-bold">
          <span className="text-red-400">AGAINST</span>
        </h2>
        <VoteList votes={againstVotes} />
      </div>
    </>
  );
}
