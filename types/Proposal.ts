import { Proposal as GqlProposal } from './generated/nounsSubgraph'; // replace 'path-to-your-generated-types' with the actual path

export enum ProposalStatus {
  Pending = 'Pending',
  Voting = 'Voting',
  Succeeded = 'Succeeded',
  Defeated = 'Defeated',
  Cancelled = 'Cancelled',
}

export interface Proposal extends Omit<GqlProposal, 'status'> {
  status: ProposalStatus;
  dynamicQuorum: number;
}
