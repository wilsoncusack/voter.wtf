import { Vote } from '../pages';
import VoteReasons from './VoteReasons';

interface VoteListProps {
  votes: Vote[];
}

export const VoteList: React.FC<VoteListProps> = ({ votes }) => {
  return (
    <div>
      {votes.map(vote => (
        <VoteReasons
          key={vote.id}
          votes={vote.votes}
          address={vote.voter.id}
          isFor={vote.supportDetailed}
          reason={vote.reason}
          block={vote.blockNumber}
          proposalTitle={vote.proposal.title}
          proposalId={vote.proposal.id}
        />
      ))}
    </div>
  );
};
