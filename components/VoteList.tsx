import { Vote } from '../types/Vote';
import VoteReasons from './VoteReasons';

interface VoteListProps {
  votes: Vote[];
}

export const VoteList: React.FC<VoteListProps> = ({ votes }) => {
  return (
    <div className="md:max-w-xl sm:max-w-full">
      {votes.map(vote => (
        <VoteReasons key={vote.id} vote={vote} />
      ))}
    </div>
  );
};
